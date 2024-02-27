import { SortColumn } from "./SortColumn"
import { SortRequest } from "./SortRequest"

export interface IListFilesReq {
    readonly sort?: SortColumn[]
    readonly foldersFirst?: boolean
    readonly ByInnerSelection?: boolean
    readonly SearchPattern?: string
    readonly IsRecursive?: boolean
    readonly FolderSize?: boolean
    readonly HideFolders?: boolean
    readonly HideFiles?: boolean
    readonly Path?: string
    readonly Sort?: SortRequest
    readonly ShowHiddenFiles?: boolean
    readonly NoCache?: boolean
    readonly View?: string
    readonly hideWatched?: boolean
    // TODO:
    readonly KeepView?: boolean
    readonly skip?: number
    readonly take?: number
}
