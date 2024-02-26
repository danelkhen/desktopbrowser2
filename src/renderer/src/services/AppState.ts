import { GridColumns } from "../components/Grid"
import { SortConfig } from "../hooks/useSorting"
import { FileColumnKeys } from "./Columns"
import { FileInfo, FsFile, ListFilesRequest, ListFilesResponse } from "../../../shared/FileService"

export interface AppState {
    readonly res: ListFilesResponse
    readonly req: ListFilesRequest
    readonly reqSorting: SortConfig
    readonly sorting: SortConfig
    readonly filesMd: { [key: string]: FileInfo }
    readonly selectedFiles: FsFile[]
}

export type FileColumns = GridColumns<FsFile>

export const sortingDefaults: SortConfig = {
    isDescending: {},
    active: [FileColumnKeys.type],
}

const reqSorting: SortConfig = { active: [], isDescending: {} }
export const initialAppState: AppState = {
    res: { Relatives: {} },
    req: {},
    reqSorting,
    sorting: { ...sortingDefaults, ...reqSorting },
    filesMd: {},
    selectedFiles: [],
}
