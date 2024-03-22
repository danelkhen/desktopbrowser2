import { css } from "@emotion/css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { SortConfig } from "src/shared/SortConfig"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { isExecutable } from "../lib/isExecutable"
import { iterableLast } from "../lib/iterableLast"
import { api } from "../services/api"
import { useReq } from "../services/useReq"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { GetNavUrl } from "./GetNavUrl"
import { ColumnKey } from "./Grid"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { descendingFirstColumns } from "./gridColumns"
import { requestToUrl } from "./parseRequest"

const pageSize = 200
export function FileBrowser() {
    console.log("FileBrowser render")
    const req = useReq()
    const [res, setRes] = useState<IListFilesRes>({})
    useEffect(() => {
        return () => {
            console.log("FileBrowser unmount")
        }
    }, [])

    const sorting = useMemo(() => getSortConfig(req), [req])
    // const [folderSelections, setFolderSelections] = useState<FolderSelections>({})

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

    const Open = useCallback(
        async (file: IFile) => {
            if (!file?.path) return
            if (file.isFolder || file.type === "link") {
                navToReq(t => ({ ...t, path: file.path }))
                return
            }
            const prompt = file.ext ? isExecutable(file.ext) : true
            if (prompt && !window.confirm("This is an executable file, are you sure you want to run it?")) {
                return
            }
            const res = await api.execute({ path: file.path, vlc: new URLSearchParams(location.search).has("vlc") })
            console.info(res)
        },
        [navToReq]
    )

    const orderBy = (column: ColumnKey) => {
        const sort = getSortBy(column)
        navToReq(t => ({ ...t, sort }))
    }

    const getSortBy = (column: ColumnKey) => {
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

    const isSortedBy = (key: ColumnKey, desc?: boolean): boolean => {
        if (!sorting[key]) return false
        if (desc !== undefined) return sorting[key] === (desc ? "desc" : "asc")
        return true
    }
    const [pageIndex, setPageIndex] = useState(0)

    const allFiles = res.files ?? []
    let files = allFiles

    files = useSearch(searchText, files)
    // files = useSorting(files, sorting, gridColumns)

    const totalPages = Math.ceil(files.length / pageSize)

    files = usePaging(files, { pageIndex, pageSize })

    const reloadFiles = useCallback(async (req: IListFilesReq) => {
        const fetchFiles = async (req: IListFilesReq) => {
            setRes(await api.listFiles(req))
        }
        if (req.folderSize) {
            setRes(await api.listFiles({ ...req, folderSize: false }))
        }
        await fetchFiles(req)
    }, [])

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { selectedFiles, setSelectedFiles } = useSelection({
        setFolderSelection,
        res,
    })
    const selectedFile = useMemo(() => iterableLast(selectedFiles), [selectedFiles])

    useEffect(() => {
        void reloadFiles(req)
    }, [reloadFiles, req])

    // useEffect(() => {
    //     void (async () => {
    //         const x = await api.getAllFolderSelections()
    //         setFolderSelections(x)
    //     })()
    // }, [])

    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            if (e.key === "Enter") {
                if (!selectedFile) return
                e.preventDefault()
                void Open(selectedFile)
            }
        }
        window.addEventListener("keydown", Win_keydown)
        return () => window.removeEventListener("keydown", Win_keydown)
    }, [Open, selectedFile])

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
                    reloadFiles={() => reloadFiles(req)}
                    isSortedBy={isSortedBy}
                    getNavUrl={getNavUrl}
                    getSortBy={getSortBy}
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
                    Open={Open}
                    orderBy={orderBy}
                    sorting={sorting}
                    hasInnerSelection={hasInnerSelection}
                />
            </header>
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                files={files}
                noHead
                Open={Open}
                orderBy={orderBy}
                sorting={sorting}
                hasInnerSelection={hasInnerSelection}
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
