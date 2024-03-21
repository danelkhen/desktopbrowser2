import { css } from "@emotion/css"
import { produce } from "immer"
import _ from "lodash"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FolderSelections } from "../../../shared/Api"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { useFilter } from "../hooks/useFilter"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { SortConfig, useSorting } from "../hooks/useSorting"
import { isExecutable } from "../lib/isExecutable"
import { iterableLast } from "../lib/iterableLast"
import { api } from "../services/api"
import { useReq } from "../services/useReq"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { ColumnKey, GridColumns } from "./Grid"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { useGridColumns } from "./gridColumns"
import { requestToUrl } from "./parseRequest"

const pageSize = 200
export function FileBrowser() {
    console.log("FileBrowser render")
    const req = useReq()
    const [res, setRes] = useState<IListFilesRes>({})

    const sorting = useMemo(() => getSortConfig(req), [req])
    const [folderSelections, setFolderSelections] = useState<FolderSelections>({})
    const gridColumns = useGridColumns(folderSelections)

    const [searchText, setSearchText] = useState("")
    const [path, setPath] = useState("")

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

    const exploreFile = async (file: IFile) => {
        if (!file?.path) return
        await api.explore({ path: file.path })
    }

    const up = () => {
        GotoPath(res?.parent?.path ?? "/")
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

    const allFiles = res.files ?? []

    const sorted = useSorting(allFiles, sorting, gridColumns)
    const filtered2 = useFilter({ req, list: sorted, getFolderSelection })
    const filtered = useSearch(searchText, filtered2)
    const { paged, totalPages, pageIndex, setPageIndex } = usePaging(filtered, {
        pageSize,
    })
    const files = paged

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

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { selectedFiles, setSelectedFiles } = useSelection({
        Open,
        setFolderSelection,
        up,
        res,
        folderSelections,
    })
    const selectedFile = useMemo(() => iterableLast(selectedFiles), [selectedFiles])

    useEffect(() => {
        void reloadFiles()
    }, [reloadFiles])

    useEffect(() => {
        void (async () => {
            const x = await api.getAllFolderSelections()
            setFolderSelections(x)
        })()
    }, [])

    return (
        <div className={style}>
            <header className={style}>
                <MainMenu
                    selectedFile={selectedFile}
                    req={req}
                    sorting={sorting}
                    res={res}
                    totalPages={totalPages}
                    pageIndex={pageIndex}
                    setPageIndex={setPageIndex}
                    gridColumns={gridColumns}
                    reloadFiles={reloadFiles}
                    GotoFolder={GotoFolder}
                    up={up}
                    exploreFile={exploreFile}
                    isSortedBy={isSortedBy}
                    navToReq={navToReq}
                    orderBy={orderBy}
                />
                <AddressBar
                    gotoPath={() => GotoPath(path)}
                    path={path}
                    setPath={setPath}
                    search={searchText}
                    setSearchText={setSearchText}
                />
                <QuickFind allFiles={allFiles} onFindFiles={v => setSelectedFiles(new Set(v))} />
                <Files
                    selectedFiles={selectedFiles}
                    allFiles={allFiles}
                    setSelectedFiles={setSelectedFiles}
                    files={files}
                    sorting={sorting}
                    noBody
                    folderSelections={folderSelections}
                    Open={Open}
                    orderBy={orderBy}
                    isSortedBy={isSortedBy}
                    hasInnerSelection={hasInnerSelection}
                />
            </header>
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                files={files}
                sorting={sorting}
                noHead
                folderSelections={folderSelections}
                Open={Open}
                orderBy={orderBy}
                isSortedBy={isSortedBy}
                hasInnerSelection={hasInnerSelection}
            />
        </div>
    )
}

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

const style = css`
    label: FileBrowser;
    header {
        position: sticky;
        top: 0;
        background-color: #111;
    }
`
