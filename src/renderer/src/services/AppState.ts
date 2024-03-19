import { FolderSelections } from "../../../shared/Api"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"

export interface AppState {
    readonly req: IListFilesReq
    readonly res: IListFilesRes
    readonly filesMd: FolderSelections
}

export const initialAppState: AppState = {
    res: {},
    req: {},
    filesMd: {},
}
