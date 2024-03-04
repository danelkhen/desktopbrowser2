import { css } from "@emotion/css"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { useLocation } from "react-router-dom"
import { Column } from "../../../shared/Column"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { colors } from "../GlobalStyle"
import { useAppState } from "../hooks/useAppState"
import { useFilter } from "../hooks/useFilter"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { SortConfig, useSorting } from "../hooks/useSorting"
import { queryToReq } from "../lib/queryToReq"
import { dispatcher } from "../services/Dispatcher"
import { store } from "../services/store"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files } from "./Files"
import { ColumnKey } from "./Grid"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"
import { gridColumns } from "./gridColumns"
import { IFile } from "../../../shared/IFile"

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

    const [selectedFiles, _setSelectedFiles] = useState(new Set<IFile>())
    const { res, filesMd } = useAppState()

    const [search2, setSearch2] = useState("")
    const [path, setPath] = useState("")

    const allFiles = res.files ?? []

    const sorted = useSorting(allFiles, sorting)
    const filtered2 = useFilter(req, sorted)
    const filtered = useSearch(search2, filtered2)
    const { paged, nextPage, prevPage, totalPages, pageIndex } = usePaging(filtered, {
        pageSize,
    })
    const files = paged

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { setSelectedFiles, selectedFile } = useSelection({
        res,
        selectedFiles,
        filesMd,
        setSelectedFiles: _setSelectedFiles,
    })

    const gotoPath = useCallback(() => dispatcher.GotoPath(path), [path])

    return (
        <>
            <header>
                <div className={navStyle}>
                    <Menu selectedFile={selectedFile} req={req} dispatcher={dispatcher} sorting={sorting} res={res} />
                    <Clock />
                </div>
                <AddressBar
                    prevPage={prevPage}
                    nextPage={nextPage}
                    gotoPath={gotoPath}
                    path={path}
                    setPath={setPath}
                    search={search2}
                    setSearch={setSearch2}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
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
        </>
    )
}

const navStyle = css`
    font-size: 10px;
    /* background-color: ${colors.bg1}; */
    background-color: #181818;
    margin: 0;
    padding: 0;
    display: flex;
    color: ${colors.fg2};
    .find {
        display: flex;
    }
    > li {
        display: flex;
        list-style: none;
    }
    > li > a {
        text-decoration: none;
        padding: 10px;
        display: flex;
    }
    &.hidden {
        visibility: hidden;
    }

    &.fixed {
        position: fixed;
        top: 0;
        width: 100%;
    }
    .clock {
        display: flex;
        flex-direction: row;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        color: #999;
    }
`

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
    const req: IListFilesReq = { ...req2, path: path }
    return req
}
