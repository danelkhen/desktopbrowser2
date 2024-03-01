import { IFileMeta } from "../../../shared/IFileMeta"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"

export interface AppState {
    readonly req: IListFilesReq
    readonly res: IListFilesRes
    readonly filesMd: { [key: string]: IFileMeta }
}

export const initialAppState: AppState = {
    res: { Relatives: {} },
    req: {},
    filesMd: {},
}
