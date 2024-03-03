import { IFileMeta } from "./IFileMeta"
import { IListFilesReq } from "./IListFilesReq"
import { IListFilesRes } from "./IListFilesRes"

export interface Api {
    saveFileMeta(md: IFileMeta): Promise<void>
    deleteFileMeta(req: { key: string }): Promise<void>
    getAllFilesMeta(): Promise<IFileMeta[]>
    getFileMeta(req: { key: string }): Promise<IFileMeta>
    listFiles(req: IListFilesReq): Promise<IListFilesRes>
    execute(req: { path: string; vlc?: boolean }): void
    explore(req: { path: string }): void
    del(req: { path: string }): Promise<void>
    trash(req: { path: string }): Promise<void>
    appInspect(): Promise<void>
    checkForUpdates(): Promise<unknown> // { isLatest: boolean; latest: string; current: string }>
    appOpen(): Promise<void>
    appExit(): Promise<void>
    appGetVersion(): Promise<string>
    appHide(): Promise<void>
}
