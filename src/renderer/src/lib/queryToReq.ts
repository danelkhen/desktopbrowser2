import { IListFilesReq } from "../../../shared/IListFilesReq"
import { urlToSort } from "@renderer/lib/sortToUrl"

export function queryToReq(s: string): IListFilesReq {
    const rest = new URLSearchParams(s)
    const x: IListFilesReq = {
        foldersFirst: rest.has("foldersFirst") ? true : undefined,
        // ByInnerSelection: rest.has("ByInnerSelection") ? true : undefined,
        SearchPattern: rest.get("SearchPattern") ?? undefined,
        recursive: rest.has("IsRecursive") ? true : undefined,
        folderSize: rest.has("FolderSize") ? true : undefined,
        hideFolders: rest.has("HideFolders") ? true : undefined,
        hideFiles: rest.has("HideFiles") ? true : undefined,
        // Path: rest.get("Path") ?? undefined,
        sort: rest.get("sort") ? urlToSort(rest.get("sort")!) : undefined,
        hidden: rest.has("ShowHiddenFiles") ? true : undefined,
        noCache: rest.has("NoCache") ? true : undefined,
        view: rest.get("View") ?? undefined,
        hideWatched: rest.has("hideWatched") ? true : undefined,
        keepView: rest.has("KeepView") ? true : undefined,
        skip: rest.get("skip") ? +rest.get("skip")! : undefined,
        take: rest.get("take") ? +rest.get("take")! : undefined,
    }

    return x
}
