import { produce } from "immer"
import { NavigateFunction } from "react-router"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IFileMeta } from "../../../shared/IFileMeta"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { ColumnKey } from "../components/Grid"
import { gridColumns } from "../components/gridColumns"
import { SortConfig } from "../hooks/useSorting"
import { getGoogleSearchLink } from "../lib/getGoogleSearchLink"
import { getSubtitleSearchLink } from "../lib/getSubtitleSearchLink"
import { isExecutable } from "../lib/isExecutable"
import { openInNewWindow } from "../lib/openInNewWindow"
import { pathToUrl } from "../lib/pathToUrl"
import { reqToQuery } from "../lib/reqToQuery"
import { api } from "./api"
import { store } from "./store"

export class Dispatcher {
    navigate?: NavigateFunction

    fetchAllFilesMetadata = async () => {
        const x = await api.getAllFilesMeta()
        const obj: { [key: string]: IFileMeta } = {}
        x.map(t => (obj[t.key] = t))
        store.update({ filesMd: obj })
    }

    private async setFileMetadata(value: IFileMeta) {
        if (value.selectedFiles == null || value.selectedFiles.length == 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [value.key]: removed, ...rest } = store.state.filesMd ?? {}
            store.update({ filesMd: rest })
            await api.deleteFileMeta({ key: value.key })
            return
        }
        store.update({ filesMd: { ...store.state.filesMd, [value.key]: value } })
        await api.saveFileMeta(value)
    }
    getFileMetadata = (key: string): IFileMeta | null => {
        const x = store.state.filesMd?.[key]
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

    hasInnerSelection = (file: IFile) => {
        return !!dispatcher.getSavedSelectedFile(file.Name)
    }

    getFileTypeOrder(type: string): number {
        const order = ["folder", "link", "file"].reverse()
        return order.indexOf(type)
    }

    updateReq(v: Partial<IListFilesReq>) {
        return this.setReq({ ...store.state.req, ...v })
    }
    private setReq(v: IListFilesReq) {
        const navigateToReq = (req: IListFilesReq) => {
            console.log("navigateToReq", req)
            const { path: Path, ...rest } = req
            this.navigate?.({ pathname: pathToUrl(Path), search: reqToQuery(rest) })
        }
        const prev = store.state.req
        if (v === prev) return
        const p1 = JSON.stringify(prev)
        const p2 = JSON.stringify(v)
        if (p1 === p2) return
        console.log({ prev, v })
        navigateToReq(v)
    }

    private deleteAndRefresh = async (file: IFile) => {
        if (!file.Path) return
        const fileOrFolder = file.IsFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.Path)) return
        await api.del({ path: file.Path })
        await this.reloadFiles()
    }

    private trashAndRefresh = async (file: IFile) => {
        if (!file.Path) return
        await api.trash({ path: file.Path })
        await this.reloadFiles()
    }

    deleteOrTrash = async ({ file, isShiftDown }: { file: IFile; isShiftDown: boolean }) => {
        if (isShiftDown) {
            await this.deleteAndRefresh(file)
            return
        }
        await this.trashAndRefresh(file)
    }

    exploreFile = async (file: IFile) => {
        if (!file?.Path) return
        await api.explore({ path: file.Path })
    }

    async fetchFiles(req: IListFilesReq) {
        const res = await api.listFiles(req)
        store.update({ res })
    }
    reloadFiles = async () => {
        if (store.state.req.folderSize) {
            const req2 = { ...store.state.req, FolderSize: false }
            await this.fetchFiles(req2)
        }
        await this.fetchFiles(store.state.req)
    }

    up = () => {
        const parent = store.state.res?.ParentFolder?.Path
        const current = store.state.req.path
        if (!parent || current === parent || pathToUrl(current) === pathToUrl(parent)) {
            this.GotoPath("/")
            return
        }
        this.GotoPath(parent)
    }
    GotoFolder = (file?: IFile) => {
        if (!file) return
        file.Path && this.GotoPath(file.Path)
    }

    GotoPath = (path: string) => {
        this.updateReq({ path: path })
    }

    Open = async (file: IFile) => {
        if (file == null) return
        if (file.IsFolder || file.type == "link") {
            this.GotoFolder(file)
            return
        }
        const prompt = file.Extension ? isExecutable(file.Extension) : true
        if (prompt && !window.confirm("This is an executable file, are you sure you want to run it?")) {
            return
        }
        if (!file.Path) return
        const res = await api.execute({ path: file.Path })
        console.info(res)
    }

    orderBy = (column: ColumnKey) => {
        const sort = produce(store.state.req.sort ?? [], sort => {
            const index = sort.findIndex(t => t.Name === column)
            if (index === 0) {
                if (!!sort[index].Descending === !!gridColumns[column].descendingFirst) {
                    sort[index].Descending = !sort[index].Descending
                } else {
                    sort.shift()
                }
                return
            }
            if (index > 0) {
                sort = [{ Name: column as Column, Descending: gridColumns[column].descendingFirst }]
                return sort
            }
            sort.unshift({ Name: column as Column, Descending: gridColumns[column].descendingFirst })
        })
        this.updateReq({ sort })
    }

    isSortedBy = (sorting: SortConfig, key: ColumnKey, desc?: boolean): boolean => {
        if (!sorting.active.includes(key)) return false
        if (desc !== undefined) return !!sorting.isDescending[key] === desc
        return true
    }

    goto = {
        up: () => this.up(),
        prev: () => this.GotoFolder(store.state.res?.PreviousSibling),
        next: () => this.GotoFolder(store.state.res?.NextSibling),
    }
    canGoto = {
        up: () => store.state.req.path !== "/",
        prev: () => !!store.state.res?.PreviousSibling,
        next: () => !!store.state.res?.NextSibling,
    }

    disableSorting = () =>
        this.updateReq({
            sort: undefined,
            foldersFirst: false,
            // ByInnerSelection: false,
        })

    isSortingDisabled = () => !store.state.req.sort && !store.state.req.foldersFirst // && store._state.req.ByInnerSelection == null

    OrderByInnerSelection = () => this.orderBy(Column.hasInnerSelection)

    google = () => store.state.res?.File && openInNewWindow(getGoogleSearchLink(store.state.res?.File))

    subs = () => store.state.res?.File && openInNewWindow(getSubtitleSearchLink(store.state.res?.File))

    explore = async (selectedFile: IFile | null) => {
        console.log(store.state)
        const file = selectedFile ?? store.state.res?.File
        if (!file) return
        await this.exploreFile(file)
    }
    // _setSelectedFiles = (v: IFile[]) => {
    //     if (arrayItemsEqual(v, store.state.selectedFiles)) return
    //     store.update({ selectedFiles: v })
    // }
}

export const dispatcher = new Dispatcher()
