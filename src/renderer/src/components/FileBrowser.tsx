import { css } from "@emotion/css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useLoaderData, useLocation, useNavigate } from "react-router-dom"
import { SortConfig } from "src/shared/SortConfig"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { isExecutable } from "../../../shared/isMediaFile"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { iterableLast } from "../lib/iterableLast"
import { api } from "../services/api"
import { useReq } from "../services/useReq"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { GetNavUrl } from "./GetNavUrl"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { requestToUrl } from "./parseRequest"
import { useVlcStatus } from "./useVlcStatus"

const descendingFirstColumns = [Column.size, Column.modified] as string[]
const pageSize = 200

export function FileBrowser() {
    const req = useReq()
    const res = useLoaderData() as IListFilesRes
    console.log("FileBrowser render", { req, res })
    useEffect(() => {
        return () => {
            console.log("FileBrowser unmount")
        }
    }, [])

    const sorting = useMemo(() => getSortConfig(req), [req])

    const [searchText, setSearchText] = useState("")
    const [path, setPath] = useState("")

    const navigate = useNavigate()
    const getNavUrl: GetNavUrl = useCallback<GetNavUrl>(
        v => {
            const prev = req
            const v2 = typeof v === "function" ? v(prev) : v
            return requestToUrl(v2)
        },
        [req]
    )
    const navToReq = useCallback(
        (v: IListFilesReq | ((prev: IListFilesReq) => IListFilesReq)) => {
            const prevUrl = getNavUrl(req)
            const newUrl = getNavUrl(v)
            if (prevUrl === newUrl) return
            console.log("navigateToReq", newUrl)
            navigate?.(newUrl)
        },
        [getNavUrl, navigate, req]
    )

    const setFolderSelection = async (key: string, value: string | null) => {
        if (!value) {
            await api.deleteFolderSelection(key)
            return
        }
        await api.saveFolderSelection({ key, value })
    }

    const hasInnerSelection = (file: IFile) => {
        return !!res.selections?.[file.name]
    }

    const GotoPath = (path: string | undefined) => {
        if (!path) return
        navToReq(t => ({ ...t, path }))
    }

    const open = useCallback(
        async (file: IFile) => {
            if (!file?.path) return
            if (file.isFolder || file.isLink) {
                navToReq(t => ({ ...t, path: file.path }))
                return
            }
            if (
                isExecutable(file.name) &&
                !window.confirm("This is an executable file, are you sure you want to run it?")
            ) {
                return
            }
            const res = await api.execute({ path: file.path, vlc: req.vlc })
            console.info(res)
        },
        [navToReq, req.vlc]
    )

    const orderBy = (column: string) => {
        const sort = getSortBy(column)
        navToReq(t => ({ ...t, sort }))
    }

    const getSortBy = (column: string) => {
        const cycle: ("asc" | "desc")[] = descendingFirstColumns.includes(column) ? ["desc", "asc"] : ["asc", "desc"]
        const current = sorting[column]
        const next = cycle[cycle.indexOf(current) + 1] as "asc" | "desc" | undefined
        const cfg: SortConfig = { ...sorting }
        if (cfg[column]) {
            delete cfg[column]
        }
        if (!next) {
            return cfg
        }
        return { [column]: next, ...cfg }
    }

    const isSortedBy = (key: string, desc?: boolean): boolean => {
        if (!sorting[key]) return false
        if (desc !== undefined) return sorting[key] === (desc ? "desc" : "asc")
        return true
    }
    const [pageIndex, setPageIndex] = useState(0)

    const allFiles = res.files ?? []
    let files = allFiles

    files = useSearch(searchText, files)

    const totalPages = Math.ceil(files.length / pageSize)

    files = usePaging(files, { pageIndex, pageSize })

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { selectedFiles, setSelectedFiles } = useSelection({
        setFolderSelection,
        res,
    })
    const selectedFile = useMemo(() => iterableLast(selectedFiles), [selectedFiles])

    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            const target = e.target as HTMLElement
            if (target.matches("input:not(#tbQuickFind),select")) return
            if (e.key === "Enter") {
                if (!selectedFile) return
                e.preventDefault()
                void open(selectedFile)
            }
        }
        window.addEventListener("keydown", Win_keydown)
        return () => window.removeEventListener("keydown", Win_keydown)
    }, [open, selectedFile])

    const location = useLocation()
    const vlcStatus = useVlcStatus(!!req.vlc)
    // [vlcRes, setVlcRes] = useState<IVlcStatus | null>(null)
    // const { vlcCurrentFile, vlcCurrentPos, vlcCurrentState } = useVlcRes(vlcRes)
    return (
        <div className={style}>
            <header className={style}>
                <MainMenu
                    selectedFile={selectedFile}
                    req={req}
                    res={res}
                    totalPages={totalPages}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    reloadFiles={() => navigate({ ...location }, { replace: true, preventScrollReset: true })}
                    isSortedBy={isSortedBy}
                    getNavUrl={getNavUrl}
                    getSortBy={getSortBy}
                    vlcStatus={vlcStatus}
                />
                <AddressBar
                    gotoPath={() => GotoPath(path)}
                    path={path}
                    setPath={setPath}
                    search={searchText}
                    setSearchText={setSearchText}
                />
                <QuickFind allFiles={allFiles} onFindFiles={v => setSelectedFiles(v)} />
                <Files
                    selectedFiles={selectedFiles}
                    allFiles={allFiles}
                    setSelectedFiles={setSelectedFiles}
                    files={files}
                    noBody
                    open={open}
                    orderBy={orderBy}
                    sorting={sorting}
                    hasInnerSelection={hasInnerSelection}
                    vlcStatus={vlcStatus}
                />
            </header>
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                files={files}
                noHead
                open={open}
                orderBy={orderBy}
                sorting={sorting}
                hasInnerSelection={hasInnerSelection}
                vlcStatus={vlcStatus}
            />
        </div>
    )
}

function getSortConfig(req: IListFilesReq): SortConfig {
    const cols = req.sort ?? {}
    if (req.foldersFirst && !cols[Column.type]) {
        return { [Column.type]: "asc", ...cols }
    }
    return cols
}

const style = css`
    label: FileBrowser;
    header {
        position: sticky;
        top: 0;
        background-color: #111;
    }
`
