import { produce } from "immer"
import _ from "lodash"
import { Dispatch, SetStateAction, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FolderSelections } from "../../../shared/Api"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { ColumnKey, GridColumns } from "../components/Grid"
import { requestToUrl } from "../components/parseRequest"
import { SortConfig } from "../hooks/useSorting"
import { getGoogleSearchLink } from "../lib/getGoogleSearchLink"
import { getSubtitleSearchLink } from "../lib/getSubtitleSearchLink"
import { isExecutable } from "../lib/isExecutable"
import { openInNewWindow } from "../lib/openInNewWindow"
import { pathToUrl } from "../lib/pathToUrl"
import { api } from "./api"

export function useDispatcher({
    req,
    res,
    setRes,
    folderSelections,
    setFolderSelections,
}: {
    req: IListFilesReq
    res: IListFilesRes
    setRes: Dispatch<SetStateAction<IListFilesRes>>
    folderSelections: FolderSelections
    setFolderSelections: Dispatch<SetStateAction<FolderSelections>>
}) {
    const navigate = useNavigate()
    const getNavUrl = (v: IListFilesReq | ((prev: IListFilesReq) => IListFilesReq)) => {
        const prev = req
        const v2 = typeof v === "function" ? v(prev) : v
        return requestToUrl(v2)
    }
    const navToReq = (v: IListFilesReq | ((prev: IListFilesReq) => IListFilesReq)) => {
        const prevUrl = getNavUrl(req)
        const newUrl = getNavUrl(v)
        if (_.isEqual(prevUrl, newUrl)) return
        console.log("navigateToReq", newUrl)
        navigate?.(newUrl)
    }

    const setFolderSelection = async (key: string, value: string | null) => {
        const meta = await getFolderSelection(key)
        if (_.isEqual(meta, value)) return
        console.log({ meta, value })
        if (!value) {
            if (!meta) {
                return
            }
            const newMd = produce(folderSelections, draft => {
                delete draft[key]
            })
            setFolderSelections(newMd)
            console.log("deleteFileMeta", key)
            await api.deleteFolderSelection(key)
            return
        }
        setFolderSelections({ ...folderSelections, [key]: value })
        await api.saveFolderSelection({ key, value })
    }
    const getFolderSelection = (key: string): string | null => {
        const x = folderSelections?.[key]
        if (!x) return null
        return x
    }

    const hasInnerSelection = (file: IFile) => {
        return !!getFolderSelection(file.name)
    }

    const deleteAndRefresh = async (file: IFile) => {
        if (!file.path) return
        const fileOrFolder = file.isFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.path)) return
        await api.del({ path: file.path })
        await reloadFiles()
    }

    const trashAndRefresh = async (file: IFile) => {
        if (!file.path) return
        await api.trash({ path: file.path })
        await reloadFiles()
    }

    const deleteOrTrash = async ({ file, isShiftDown }: { file: IFile; isShiftDown: boolean }) => {
        if (isShiftDown) {
            await deleteAndRefresh(file)
            return
        }
        await trashAndRefresh(file)
    }

    const exploreFile = async (file: IFile) => {
        if (!file?.path) return
        await api.explore({ path: file.path })
    }

    const reloadFiles = useCallback(async () => {
        const fetchFiles = async (req: IListFilesReq) => {
            const res = await api.listFiles(req)
            setRes(res)
        }
        if (req.folderSize) {
            const req2 = { ...req, FolderSize: false }
            await fetchFiles(req2)
        }
        await fetchFiles(req)
    }, [req, setRes])

    const up = () => {
        const parent = res?.parent?.path
        const current = req.path
        if (!parent || current === parent || pathToUrl(current) === pathToUrl(parent)) {
            GotoPath("/")
            return
        }
        GotoPath(parent)
    }
    const GotoFolder = (file: IFile | undefined) => {
        GotoPath(file?.path)
    }

    const GotoPath = (path: string | undefined) => {
        if (!path) return
        navToReq(t => ({ ...t, path }))
    }

    const Open = async (file: IFile) => {
        if (!file) return
        if (file.isFolder || file.type === "link") {
            GotoFolder(file)
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

    const orderBy = (column: ColumnKey, gridColumns: GridColumns<IFile>) => {
        const sort = produce(req.sort ?? [], sort => {
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
        navToReq(t => ({ ...t, sort }))
    }

    const isSortedBy = (sorting: SortConfig, key: ColumnKey, desc?: boolean): boolean => {
        if (!sorting.active.includes(key)) return false
        if (desc !== undefined) return !!sorting.isDescending[key] === desc
        return true
    }

    const prev = () => GotoFolder(res?.prev)
    const next = () => GotoFolder(res?.next)
    const canUp = () => req.path !== "/"
    const canPrev = () => !!res?.prev
    const canNext = () => !!res?.next

    const google = () => res?.file && openInNewWindow(getGoogleSearchLink(res?.file))
    const subs = () => res?.file && openInNewWindow(getSubtitleSearchLink(res?.file))

    return {
        setFolderSelection,
        getFolderSelection,
        hasInnerSelection,
        deleteAndRefresh,
        trashAndRefresh,
        deleteOrTrash,
        exploreFile,
        reloadFiles,
        up,
        GotoFolder,
        GotoPath,
        Open,
        orderBy,
        isSortedBy,
        prev,
        next,
        canUp,
        canPrev,
        canNext,
        google,
        subs,
        navToReq,
        getNavUrl,
    }
}
