import { css } from "@emotion/css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { useLocation } from "react-router-dom"
import { Column } from "../../../shared/Column"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { useAppState } from "../hooks/useAppState"
import { useFilter } from "../hooks/useFilter"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { SortConfig, useSorting } from "../hooks/useSorting"
import { iterableLast } from "../lib/iterableLast"
import { queryToReq } from "../lib/queryToReq"
import { dispatcher } from "../services/Dispatcher"
import { store } from "../services/store"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { ColumnKey } from "./Grid"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { gridColumns } from "./gridColumns"

const pageSize = 200

export function FileBrowser() {
    console.log("FileBrowser render")
    const navigate = useNavigate()
    dispatcher.navigate = navigate

    const { pathname, search } = useLocation()
    const req = useMemo(() => parseRequest(pathname, search), [pathname, search])
    const sorting = useMemo(() => getSortConfig(req), [req])
    useEffect(() => {
        store.update({
            req,
        })
        void dispatcher.reloadFiles()
    }, [req, sorting])

    useEffect(() => {
        void dispatcher.fetchAllFilesMetadata()
    }, [])

    const { res } = useAppState()

    const [search2, setSearch2] = useState("")
    const [path, setPath] = useState("")

    const allFiles = res.files ?? []

    const sorted = useSorting(allFiles, sorting)
    const filtered2 = useFilter(req, sorted)
    const filtered = useSearch(search2, filtered2)
    const { paged, totalPages, pageIndex, setPageIndex } = usePaging(filtered, {
        pageSize,
    })
    const files = paged

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { selectedFiles, setSelectedFiles } = useSelection({
        res,
    })
    const selectedFile = useMemo(() => iterableLast(selectedFiles), [selectedFiles])

    const gotoPath = useCallback(() => dispatcher.GotoPath(path), [path])

    return (
        <div className={style}>
            <header>
                <MainMenu selectedFile={selectedFile} req={req} dispatcher={dispatcher} sorting={sorting} res={res} />
                <AddressBar
                    gotoPath={gotoPath}
                    path={path}
                    setPath={setPath}
                    search={search2}
                    setSearch={setSearch2}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                    setPageIndex={setPageIndex}
                />
                <QuickFind allFiles={allFiles} onFindFiles={v => setSelectedFiles(new Set(v))} />
            </header>
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                columns={gridColumns}
                files={files}
                sorting={sorting}
            />
        </div>
    )
}

// const navStyle = css`
//     label: navStyle;
//     font-size: 10px;
//     /* background-color: ${colors.bg1}; */
//     background-color: #181818;
//     margin: 0;
//     padding: 0;
//     display: flex;
//     color: ${colors.fg2};
//     .find {
//         display: flex;
//     }
//     > li {
//         display: flex;
//         list-style: none;
//     }
//     > li > a {
//         text-decoration: none;
//         padding: 10px;
//         display: flex;
//     }
//     &.hidden {
//         visibility: hidden;
//     }

//     &.fixed {
//         position: fixed;
//         top: 0;
//         width: 100%;
//     }
// `

function getSortConfig(req: IListFilesReq) {
    const active: ColumnKey[] = []
    const isDescending: Record<ColumnKey, boolean> = {}
    const cols = req.sort ?? []
    if (req.foldersFirst && !cols.find(t => t.name === Column.type)) {
        active.push(Column.type)
    }
    // if (req.ByInnerSelection && !cols.find(t => t.Name === Column.hasInnerSelection)) {
    //     active.push(Column.hasInnerSelection)
    // }
    for (const col of cols ?? []) {
        active.push(col.name)
        if (col.desc) {
            isDescending[col.name] = true
        }
    }
    console.log("setSorting", active)
    const sorting: SortConfig = { active, isDescending }
    return sorting
}

function parseRequest(path: string, search: string) {
    const req2: IListFilesReq = queryToReq(search)
    const req: IListFilesReq = { ...req2, path: decodeURIComponent(path) }
    return req
}

const style = css`
    header {
        position: sticky;
        top: 0;
        background-color: #111;
    }
`
