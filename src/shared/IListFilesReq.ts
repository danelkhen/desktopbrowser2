import { SortConfig } from "./SortConfig"

export interface IListFilesReq {
    readonly sort?: SortConfig
    readonly foldersFirst?: boolean
    readonly searchPattern?: string
    readonly recursive?: boolean
    readonly folderSize?: boolean
    readonly hideFolders?: boolean
    readonly hideFiles?: boolean
    readonly path?: string
    readonly hidden?: boolean
    readonly noCache?: boolean
    readonly view?: string
    readonly hideWatched?: boolean
    readonly vlc?: boolean
    // TODO:
    readonly keepView?: boolean
    readonly skip?: number
    readonly take?: number
}
