import { css } from "@emotion/css"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { SortConfig } from "../hooks/useSorting"
import { dispatcher } from "../services/Dispatcher"
import { AddressBar } from "./AddressBar"
import { Files } from "./Files"
import { MainMenu } from "./MainMenu"
import { QuickFind } from "./QuickFind"
import { gridColumns } from "./gridColumns"

export function Header({
    selectedFile,
    req,
    sorting,
    res,
    gotoPath,
    path,
    setPath,
    search2,
    setSearch2,
    pageIndex,
    totalPages,
    setPageIndex,
    allFiles,
    setSelectedFiles,
    selectedFiles,
    files,
}: {
    selectedFile: IFile | undefined
    req: IListFilesReq
    sorting: SortConfig
    res: IListFilesRes
    gotoPath: () => void
    path: string
    setPath: (v: string) => void
    search2: string
    setSearch2: (v: string) => void
    pageIndex: number
    totalPages: number
    setPageIndex: (v: number) => void
    allFiles: IFile[]
    setSelectedFiles: (selectedFiles: Set<IFile>) => Promise<void>
    selectedFiles: Set<IFile>
    files: IFile[]
}) {
    return (
        <header className={style}>
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
            <Files
                selectedFiles={selectedFiles}
                allFiles={allFiles}
                setSelectedFiles={setSelectedFiles}
                columns={gridColumns}
                files={files}
                sorting={sorting}
                noBody
            />
        </header>
    )
}

const style = css`
    label: Header;
    position: sticky;
    top: 0;
    background-color: #111;
`
