/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { produce } from "immer"
import { NavigateFunction } from "react-router"
import { ColumnKey } from "../components/Grid"
import { gridColumns } from "../components/gridColumns"
import { SortConfig } from "../hooks/useSorting"
import { arrayItemsEqual } from "../lib/arrayItemsEqual"
import { getGoogleSearchLink } from "../lib/getGoogleSearchLink"
import { getSubtitleSearchLink } from "../lib/getSubtitleSearchLink"
import { isExecutable } from "../lib/isExecutable"
import { openInNewWindow } from "../lib/openInNewWindow"
import { pathToUrl } from "../lib/pathToUrl"
import { queryToReq } from "../lib/queryToReq"
import { reqToQuery } from "../lib/reqToQuery"
import { sortingDefaults } from "./AppState"
import { FileColumnKeys } from "./Columns"
import { FileInfo, FsFile, ListFilesRequest } from "./FileService"
import { api } from "./api"
import { store } from "./store"

export class Dispatcher {
    navigate?: NavigateFunction

    fetchAllFilesMetadata = async () => {
        const x = await api.getAllFilesMetadata()
        const obj: { [key: string]: FileInfo } = {}
        x.map(t => (obj[t.key] = t))
        store.update({ filesMd: obj })
    }

    private async setFileMetadata(value: FileInfo) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [value.key]: removed, ...rest } = store._state.filesMd ?? {}
            store.update({ filesMd: rest })
            await api.deleteFileMetadata({ key: value.key })
            return
        }
        store.update({ filesMd: { ...store._state.filesMd, [value.key]: value } })
        await api.saveFileMetadata(value)
    }
    getFileMetadata = (key: string): FileInfo | null => {
        const x = store._state.filesMd?.[key]
        if (!x) return null
        return x
    }
    getSavedSelectedFile = (folder: string) => {
        const x = this.getFileMetadata(folder)
        if (x == null || x.selectedFiles == null) return null
        return x.selectedFiles[0]
    }
    saveSelectedFile = async (folderName: string, filename: string) => {
        await this.setFileMetadata({
            key: folderName,
            selectedFiles: filename ? [filename] : undefined,
            collection: "",
        })
    }

    hasInnerSelection = (file: FsFile) => {
        return dispatcher.getSavedSelectedFile(file.Name) != null
    }

    getFileTypeOrder(type: string): number {
        const order = ["folder", "link", "file"].reverse()
        return order.indexOf(type)
    }

    private updateReq(v: Partial<ListFilesRequest>) {
        return this.setReq({ ...store._state.req, ...v })
    }
    private setReq(v: ListFilesRequest) {
        const navigateToReq = (req: ListFilesRequest) => {
            console.log("navigateToReq", req)
            const { Path, ...rest } = req
            this.navigate?.({ pathname: `/${pathToUrl(Path)}`, search: reqToQuery(rest) })
        }
        const prev = store._state.req
        if (v === prev) return
        const p1 = JSON.stringify(prev)
        const p2 = JSON.stringify(v)
        if (p1 === p2) return
        console.log({ prev, v })
        navigateToReq(v)
    }

    private useReqSorting(req: ListFilesRequest) {
        const active: ColumnKey[] = []
        const isDescending: Record<ColumnKey, boolean> = {}
        const cols = req.sort ?? []
        if (req.foldersFirst && !cols.find(t => t.Name === FileColumnKeys.type)) {
            active.push(FileColumnKeys.type)
        }
        if (req.ByInnerSelection && !cols.find(t => t.Name === FileColumnKeys.hasInnerSelection)) {
            active.push(FileColumnKeys.hasInnerSelection)
        }
        for (const col of cols ?? []) {
            active.push(col.Name)
            if (col.Descending) {
                isDescending[col.Name] = true
            }
        }
        console.log("setSorting", active)
        const sorting: Pick<SortConfig, "active" | "isDescending"> = { active, isDescending }
        return sorting
    }

    parseRequest = async (path: string, s: string) => {
        const req2: ListFilesRequest = queryToReq(s)
        const req = { ...req2, Path: path }
        const reqSorting = this.useReqSorting(req)
        store.update({ req, reqSorting, sorting: { ...sortingDefaults, ...reqSorting } })
        await this.reloadFiles()
    }

    private deleteAndRefresh = async (file: FsFile) => {
        if (!file.Path) return
        const fileOrFolder = file.IsFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
        await api.del({ Path: file.Path })
        await this.reloadFiles()
    }

    private trashAndRefresh = async (file: FsFile) => {
        if (!file.Path) return
        await api.trash({ Path: file.Path })
        await this.reloadFiles()
    }

    deleteOrTrash = async ({ file, isShiftDown }: { file: FsFile; isShiftDown: boolean }) => {
        if (isShiftDown) {
            await this.deleteAndRefresh(file)
            return
        }
        await this.trashAndRefresh(file)
    }

    explore = async (file: FsFile) => {
        if (!file?.Path) return
        await api.explore({ Path: file.Path })
    }

    async fetchFiles(req: ListFilesRequest) {
        const res = await api.listFiles(req)
        store.update({ res })
    }
    private reloadFiles = async () => {
        if (store._state.req.FolderSize) {
            const req2 = { ...store._state.req, FolderSize: false }
            await this.fetchFiles(req2)
        }
        await this.fetchFiles(store._state.req)
    }

    up = () => {
        store._state.res?.Relatives?.ParentFolder && this.GotoFolder(store._state.res.Relatives.ParentFolder)
    }
    GotoFolder = (file?: FsFile) => {
        if (!file) return
        file.Path && this.GotoPath(file.Path)
    }

    GotoPath = (path: string) => {
        this.updateReq({ Path: path })
    }

    Open = async (file: FsFile) => {
        if (file == null) return
        if (file.IsFolder || file.type == "link") {
            this.GotoFolder(file)
            return
        }
        const prompt = file.Extension ? isExecutable(file.Extension) : true
        if (prompt && !window.confirm("This is an executable file, are you sure you want to run it?")) {
            return
        }
        const res = await this.Execute(file)
        console.info(res)
    }

    private Execute = async (file: FsFile) => {
        if (!file.Path) return
        await api.execute({ Path: file.Path })
    }

    orderBy = (column: ColumnKey) => {
        // const sorting = store._state.sorting
        const sort = produce(store._state.req.sort ?? [], sort => {
            // let sort = _.cloneDeep(store._state.req.sort ?? [])
            const index = sort.findIndex(t => t.Name === column)
            if (index === 0) {
                if (!!sort[index].Descending === !!gridColumns[column].descendingFirst) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    sort[index].Descending = !sort[index].Descending
                } else {
                    sort.shift()
                }
                return
            }
            if (index > 0) {
                sort = [{ Name: column, Descending: gridColumns[column].descendingFirst }]
                return sort
            }
            sort.unshift({ Name: column, Descending: gridColumns[column].descendingFirst })
        })
        this.updateReq({ sort })
    }

    isSortedBy = (key: ColumnKey, desc?: boolean): boolean => {
        if (!store._state.sorting.active.includes(key)) return false
        if (desc !== undefined) return !!store._state.sorting.isDescending[key] === desc
        return true
    }

    goto = {
        up: () => this.GotoFolder(store._state.res?.Relatives?.ParentFolder),
        prev: () => this.GotoFolder(store._state.res?.Relatives?.PreviousSibling),
        next: () => this.GotoFolder(store._state.res?.Relatives?.NextSibling),
    }
    canGoto = {
        up: () => !!store._state.res?.Relatives?.ParentFolder,
        prev: () => !!store._state.res?.Relatives?.PreviousSibling,
        next: () => !!store._state.res?.Relatives?.NextSibling,
    }
    toggle = {
        FolderSize: () => this.updateReq({ FolderSize: !store._state.req.FolderSize }),
        foldersFirst: () => this.updateReq({ foldersFirst: !store._state.req.foldersFirst }),
        Folders: () => this.updateReq({ HideFolders: !store._state.req.HideFolders }),
        Files: () => this.updateReq({ HideFiles: !store._state.req.HideFiles }),
        Recursive: () => this.updateReq({ IsRecursive: !store._state.req.IsRecursive }),
        Keep: () => this.updateReq({ KeepView: !store._state.req.KeepView }),
        Hidden: () => this.updateReq({ ShowHiddenFiles: !store._state.req.ShowHiddenFiles }),
        hideWatched: () => this.updateReq({ hideWatched: !store._state.req.hideWatched }),
    }
    isToggled = {
        FolderSize: () => !!store._state.req.FolderSize,
        foldersFirst: () => !!store._state.req.foldersFirst,
        Folders: () => !!store._state.req.HideFolders,
        Files: () => !!store._state.req.HideFiles,
        Recursive: () => !!store._state.req.IsRecursive,
        Keep: () => !!store._state.req.KeepView,
        Hidden: () => !!store._state.req.ShowHiddenFiles,
        hideWatched: () => !!store._state.req.hideWatched,
    }

    disableSorting = () =>
        this.updateReq({
            sort: undefined,
            foldersFirst: false,
            ByInnerSelection: false,
        })

    isSortingDisabled = () =>
        !store._state.req.sort && !store._state.req.foldersFirst && store._state.req.ByInnerSelection == null

    OrderByInnerSelection = () => this.orderBy(FileColumnKeys.hasInnerSelection)
    isOrderedByInnerSelection = () => this.isSortedBy(FileColumnKeys.hasInnerSelection)

    google = () => store._state.res?.File && openInNewWindow(getGoogleSearchLink(store._state.res?.File))

    subs = () => store._state.res?.File && openInNewWindow(getSubtitleSearchLink(store._state.res?.File))

    Explore = () => store._state.res?.File && this.explore(store._state.res?.File)
    _setSelectedFiles = (v: FsFile[]) => {
        if (arrayItemsEqual(v, store._state.selectedFiles)) return
        store.update({ selectedFiles: v })
    }
}

export const dispatcher = new Dispatcher()
