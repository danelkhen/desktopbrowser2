import { css } from "@emotion/css"
import { useEffect, useMemo, useState } from "react"
import { Column } from "../../../shared/Column"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { useFilter } from "../hooks/useFilter"
import { usePaging } from "../hooks/usePaging"
import { useSearch } from "../hooks/useSearch"
import { useSelection } from "../hooks/useSelection"
import { SortConfig, useSorting } from "../hooks/useSorting"
import { iterableLast } from "../lib/iterableLast"
import { useDispatcher } from "../services/Dispatcher"
import { api } from "../services/api"
import { useReq } from "../services/useReq"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { ColumnKey } from "./Grid"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { FolderSelections } from "../../../shared/Api"
import { useGridColumns } from "./gridColumns"

const pageSize = 200
export function FileBrowser() {
    console.log("FileBrowser render")
    const req = useReq()
    const [res, setRes] = useState<IListFilesRes>({})

    const sorting = useMemo(() => getSortConfig(req), [req])
    const [folderSelections, setFolderSelections] = useState<FolderSelections>({})
    const gridColumns = useGridColumns(folderSelections)

    // const { res } = useAppState()

    const [search2, setSearch2] = useState("")
    const [path, setPath] = useState("")

    const allFiles = res.files ?? []

    const sorted = useSorting(allFiles, sorting, gridColumns)
    const filtered2 = useFilter(req, sorted, res, setRes, folderSelections, setFolderSelections)
    const filtered = useSearch(search2, filtered2)
    const { paged, totalPages, pageIndex, setPageIndex } = usePaging(filtered, {
        pageSize,
    })
    const files = paged

    useEffect(() => {
        setPath(req.path ?? "")
    }, [req.path])

    const { selectedFiles, setSelectedFiles } = useSelection({
        req,
        res,
        setRes,
        folderSelections,
        setFolderSelections,
    })
    const selectedFile = useMemo(() => iterableLast(selectedFiles), [selectedFiles])
    const { GotoPath, reloadFiles } = useDispatcher(req, res, setRes, folderSelections, setFolderSelections)
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
                    setRes={setRes}
                    folderSelections={folderSelections}
                    setFolderSelections={setFolderSelections}
                    gridColumns={gridColumns}
                />
                <AddressBar
                    gotoPath={() => GotoPath(path)}
                    path={path}
                    setPath={setPath}
                    search={search2}
                    setSearch={setSearch2}
                />
                <QuickFind allFiles={allFiles} onFindFiles={v => setSelectedFiles(new Set(v))} />
                <Files
                    req={req}
                    res={res}
                    setRes={setRes}
                    selectedFiles={selectedFiles}
                    allFiles={allFiles}
                    setSelectedFiles={setSelectedFiles}
                    files={files}
                    sorting={sorting}
                    noBody
                    folderSelections={folderSelections}
                    setFolderSelections={setFolderSelections}
                />
            </header>
            <Files
                req={req}
                res={res}
                setRes={setRes}
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                files={files}
                sorting={sorting}
                noHead
                folderSelections={folderSelections}
                setFolderSelections={setFolderSelections}
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
