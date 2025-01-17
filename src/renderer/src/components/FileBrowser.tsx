import { useCallback, useEffect, useMemo, useState } from "react"
import { useLoaderData, useLocation, useNavigate } from "react-router-dom"
import { ISorting } from "src/shared/ISorting"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { isExecutable } from "../../../shared/isMediaFile"
import { pageSize, usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { api } from "../services/api"
import { useReq } from "../services/useReq"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { GetNavUrl } from "./GetNavUrl"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { requestToUrl } from "./parseRequest"

const descendingFirstColumns = [Column.size, Column.modified] as string[]

export function FileBrowser() {
    const req = useReq()
    const res = useLoaderData() as IListFilesRes
    console.log("FileBrowser render", { req, res })
    const [searchText, setSearchText] = useState("")
    const [path, setPath] = useState("")

    const location = useLocation()
    const pageIndex = (req.page ?? 1) - 1
    // const [pageIndex, setPageIndex] = useState(0)
    // const [pageIndexInView, setPageIndexInView] = useState(0)
    // const pageIndex = _pageIndex !== null ? _pageIndex : pageIndexInView

    useEffect(() => {
        return () => {
            console.log("FileBrowser unmount")
        }
    }, [])

    const sorting = useMemo(() => getSortConfig(req), [req])

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

    const setPageIndex = useCallback(
        (v: number) => {
            navToReq(t => ({ ...t, page: v + 1 }))
        },
        [navToReq]
    )

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
        const next = cycle[cycle.indexOf(current!) + 1] as "asc" | "desc" | undefined
        const cfg: ISorting = { ...sorting }
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

    const allFiles = res.files ?? []
    let files = allFiles

    files = useSearch(searchText, files)

    const totalPages = Math.ceil(files.length / pageSize)

    // useEffect(() => {
    //     if (!files) return
    //     setPageIndex(0)
    // }, [files])

    files = usePaging(files, {
        pageIndex,
    })
    // files = useShowMore(files, {
    //     _pageIndex,
    //     pageIndex,
    //     pageIndexInView,
    //     setPageIndexInView,
    //     containerSelector: "tbody",
    // })
    // console.log({ pageIndex, totalPages })
    // useLayoutEffect(() => {
    //     const listEl = document.querySelector<HTMLElement>("tbody")
    //     if (!listEl) return
    //     const listRect = listEl.getBoundingClientRect()
    //     const scrollEl = document.documentElement.getBoundingClientRect()
    //     const scrollRect = scrollEl.getBoundingClientRect()
    //     const avgHeight = listEl.offsetHeight / listEl.childNodes.length ?? 1
    // })

    // useEffect(() => {
    //     const showMore = () => {
    //         console.log("showMore", { totalPages })
    //         setPageIndex(t => (t + 1 < totalPages ? t + 1 : t))
    //     }
    //     const scrollEl = document.documentElement
    //     const handler = _.debounce(() => {
    //         if (scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 200) {
    //             showMore()
    //         }
    //     }, 200)
    //     window.addEventListener("scrollend", handler)
    //     return () => window.removeEventListener("scrollend", handler)
    // }, [totalPages])

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { selectedFiles, setSelectedFiles } = useSelection({
        res,
    })
    const selectedFile = selectedFiles[selectedFiles.length - 1]

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

    // useLayoutEffect(() => {
    //     window.addEventListener("scroll", () => {
    //         itemsInView(files, "tbody")
    //     })
    // }, [files])

    const style = "sticky top-0 bg-neutral-950"
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
            />
        </div>
    )
}

function getSortConfig(req: IListFilesReq): ISorting {
    const cols = req.sort ?? {}
    if (req.foldersFirst && !cols[Column.type]) {
        return { [Column.type]: "asc", ...cols }
    }
    return cols
}
