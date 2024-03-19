import { produce } from "immer"
import _ from "lodash"
import { NavigateFunction } from "react-router"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
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

    fetchAllFilesMeta = async () => {
        const x = await api.getAllFolderSelections()
        // const obj: { [key: string]: IFileMeta } = {}
        // x.map(t => (obj[t.key] = t))
        store.update({ filesMd: x })
    }

    async setFolderSelection(key: string, value: string | null) {
        const meta = await this.getFolderSelection(key)
        if (_.isEqual(meta, value)) return
        console.log({ meta, value })
        if (!value) {
            if (!meta) {
                return
            }
            const newMd = produce(store.state.filesMd, draft => {
                delete draft[key]
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // const { [key]: removed, ...rest } = store.state.filesMd ?? {}
            store.update({ filesMd: newMd })
            console.log("deleteFileMeta", key)
            await api.deleteFolderSelection(key)
            return
        }
        store.update({ filesMd: { ...store.state.filesMd, [key]: value } })
        await api.saveFolderSelection({ key, value })
    }
    getFolderSelection = (key: string): string | null => {
        const x = store.state.filesMd?.[key]
        if (!x) return null
        return x
    }
    // setFolderSelection = async (folderName: string, filename: string | null) => {
    //     const meta: IFileMeta = { selectedFiles: filename ? [filename] : undefined }
    //     await this.setFolderSelection(folderName, meta)
    // }

    hasInnerSelection = (file: IFile) => {
        return !!dispatcher.getFolderSelection(file.name)
    }

    getFileTypeOrder(type: string): number {
        const order = ["folder", "link", "file"].reverse()
        return order.indexOf(type)
    }

    updateReq = (v: Partial<IListFilesReq>) => {
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
        if (!file.path) return
        const fileOrFolder = file.isFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.path)) return
        await api.del({ path: file.path })
        await this.reloadFiles()
    }

    private trashAndRefresh = async (file: IFile) => {
        if (!file.path) return
        await api.trash({ path: file.path })
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
        if (!file?.path) return
        await api.explore({ path: file.path })
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
        const parent = store.state.res?.parent?.path
        const current = store.state.req.path
        if (!parent || current === parent || pathToUrl(current) === pathToUrl(parent)) {
            this.GotoPath("/")
            return
        }
        this.GotoPath(parent)
    }
    GotoFolder = (file?: IFile) => {
        if (!file) return
        file.path && this.GotoPath(file.path)
    }

    GotoPath = (path: string) => {
        this.updateReq({ path: path })
    }

    Open = async (file: IFile) => {
        if (!file) return
        if (file.isFolder || file.type === "link") {
            this.GotoFolder(file)
            return
        }
        const prompt = file.ext ? isExecutable(file.ext) : true
        if (prompt && !window.confirm("This is an executable file, are you sure you want to run it?")) {
            return
        }
        if (!file.path) return
        const res = await api.execute({ path: file.path, vlc: new URLSearchParams(location.search).has("vlc") })
        console.info(res)
    }

    orderBy = (column: ColumnKey) => {
        const sort = produce(store.state.req.sort ?? [], sort => {
            const index = sort.findIndex(t => t.name === column)
            if (index === 0) {
                if (!!sort[index].desc === !!gridColumns[column].descendingFirst) {
                    sort[index].desc = !sort[index].desc
                } else {
                    sort.shift()
                }
                return
            }
            if (index > 0) {
                sort = [{ name: column as Column, desc: gridColumns[column].descendingFirst }]
                return sort
            }
            sort.unshift({ name: column as Column, desc: gridColumns[column].descendingFirst })
        })
        this.updateReq({ sort })
    }

    isSortedBy = (sorting: SortConfig, key: ColumnKey, desc?: boolean): boolean => {
        if (!sorting.active.includes(key)) return false
        if (desc !== undefined) return !!sorting.isDescending[key] === desc
        return true
    }

    prev = () => this.GotoFolder(store.state.res?.prev)
    next = () => this.GotoFolder(store.state.res?.next)
    canUp = () => store.state.req.path !== "/"
    canPrev = () => !!store.state.res?.prev
    canNext = () => !!store.state.res?.next
    orderByInnerSelection = () => this.orderBy(Column.hasInnerSelection)
    google = () => store.state.res?.file && openInNewWindow(getGoogleSearchLink(store.state.res?.file))
    subs = () => store.state.res?.file && openInNewWindow(getSubtitleSearchLink(store.state.res?.file))
}

export const dispatcher = new Dispatcher()
