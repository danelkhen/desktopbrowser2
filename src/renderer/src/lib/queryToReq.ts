import { ListFilesRequest } from "../../../shared/FileService"
import { urlToSort } from "@renderer/lib/sortToUrl"

export function queryToReq(s: string): ListFilesRequest {
    const rest = new URLSearchParams(s)
    const x: ListFilesRequest = {
        foldersFirst: rest.has("foldersFirst") ? true : undefined,
        ByInnerSelection: rest.has("ByInnerSelection") ? true : undefined,
        SearchPattern: rest.get("SearchPattern") ?? undefined,
        IsRecursive: rest.has("IsRecursive") ? true : undefined,
        FolderSize: rest.get("FolderSize") ? true : undefined,
        HideFolders: rest.has("HideFolders") ? true : undefined,
        HideFiles: rest.has("HideFiles") ? true : undefined,
        Path: rest.get("Path") ?? undefined,
        sort: rest.get("sort") ? urlToSort(rest.get("sort")!) : undefined,
        ShowHiddenFiles: rest.has("ShowHiddenFiles") ? true : undefined,
        NoCache: rest.get("NoCache") ? true : undefined,
        View: rest.get("View") ?? undefined,
        hideWatched: rest.get("hideWatched") ? true : undefined,
        KeepView: rest.get("KeepView") ? true : undefined,
        skip: rest.get("skip") ? +rest.get("skip")! : undefined,
        take: rest.get("take") ? +rest.get("take")! : undefined,
    }

    return x
}
