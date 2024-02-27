import { css } from "@emotion/css"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useLocation } from "react-router-dom"
import { colors } from "../GlobalStyle"
import { useAppState } from "../hooks/useAppState"
import { useFilter } from "../hooks/useFilter"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { useSorting } from "../hooks/useSorting"
import { dispatcher } from "../services/Dispatcher"
import { AddressBar } from "./AddressBar"
import { Clock } from "./Clock"
import { Files } from "./Files"
import { Menu } from "./Menu"
import { QuickFind } from "./QuickFind"
import { gridColumns } from "./gridColumns"

const pageSize = 200

export function FileBrowser() {
    console.log("FileBrowser render")
    const state = useAppState()
    const navigate = useNavigate()
    dispatcher.navigate = navigate

    const { pathname, search } = useLocation()
    useEffect(() => {
        void dispatcher.parseRequest(pathname, search)
    }, [pathname, search])

    useEffect(() => {
        void dispatcher.fetchAllFilesMetadata()
    }, [])

    const { req, res, sorting } = state
    const [search2, setSearch2] = useState("")
    const [path, setPath] = useState("")
    const [theme, setTheme] = useState("dark")

    const allFiles = res.Files ?? []

    const sorted = useSorting(allFiles, sorting)
    const filtered2 = useFilter(req, sorted)
    const filtered = useSearch(search2, filtered2)
    const { paged, nextPage, prevPage, totalPages, pageIndex } = usePaging(filtered, {
        pageSize,
    })
    const files = paged

    useEffect(() => {
        setPath(req.Path ?? "")
    }, [req.Path])

    const { setSelectedFiles, selectedFiles, selectedFile } = useSelection(state)

    const gotoPath = useCallback(() => dispatcher.GotoPath(path), [path])

    return (
        <>
            <header>
                <div className={navStyle}>
                    <Menu selectedFile={selectedFile} req={state.req} dispatcher={dispatcher} />
                    <Clock />
                </div>
                <AddressBar
                    prevPage={prevPage}
                    nextPage={nextPage}
                    gotoPath={gotoPath}
                    path={path}
                    setPath={setPath}
                    theme={theme}
                    setTheme={setTheme}
                    search={search2}
                    setSearch={setSearch2}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                />
                <QuickFind allFiles={allFiles} onFindFiles={setSelectedFiles} />
            </header>
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                columns={gridColumns}
                files={files}
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
