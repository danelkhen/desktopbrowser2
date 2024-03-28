import { IListFilesReq } from "./IListFilesReq"
import { IListFilesRes } from "./IListFilesRes"

export interface IWsApi {
    onVlcStatusChanged(e: IVlcStatus): void
    monitorVlcStatus(enabled: boolean): Promise<IVlcStatus>
}
export interface Api {
    vlcStatus(): Promise<IVlcStatus>
    saveFolderSelection(req: { key: string; value: string }): Promise<void>
    deleteFolderSelection(key: string): Promise<void>
    listFiles(req: IListFilesReq): Promise<IListFilesRes>
    execute(req: { path: string; vlc?: boolean }): void
    explore(req: { path: string }): void
    del(req: { path: string }): Promise<void>
    trash(req: { path: string }): Promise<void>
    appInspect(): Promise<void>
    checkForUpdates(): Promise<unknown>
    appOpen(): Promise<void>
    appExit(): Promise<void>
    appGetVersion(): Promise<string>
    appHide(): Promise<void>
}
export interface IVlcStatus {
    path?: string
    paused?: boolean
    playing?: boolean
    stopped?: boolean
    position?: number
    running?: boolean
}

export interface FolderSelections {
    [key: string]: string | undefined
}
