import { GridColumns } from "../components/Grid"
import { SortConfig } from "../hooks/useSorting"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IFileMeta } from "../../../shared/IFileMeta"

export interface AppState {
    readonly res: IListFilesRes
    readonly req: IListFilesReq
    readonly sorting: SortConfig
    readonly filesMd: { [key: string]: IFileMeta }
    readonly selectedFiles: IFile[]
}

export type FileColumns = GridColumns<IFile>

export const sortingDefaults: SortConfig = {
    isDescending: {},
    active: [Column.type],
}

const reqSorting: SortConfig = { active: [], isDescending: {} }
export const initialAppState: AppState = {
    res: { Relatives: {} },
    req: {},
    sorting: { ...sortingDefaults, ...reqSorting },
    filesMd: {},
    selectedFiles: [],
}
