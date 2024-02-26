import { ListFilesRequest } from "../../../shared/FileService"
import { sortToUrl } from "@renderer/lib/sortToUrl"

export function reqToQuery(rest: ListFilesRequest) {
    console.log("reqToQuery", rest)
    const obj = {
        foldersFirst: rest.foldersFirst ? "" : undefined,
        ByInnerSelection: rest.ByInnerSelection ? "" : undefined,
        SearchPattern: rest.SearchPattern ? rest.SearchPattern : undefined,
        IsRecursive: rest.IsRecursive ? "" : undefined,
        FolderSize: rest.FolderSize ? "" : undefined,
        HideFolders: rest.HideFolders ? "" : undefined,
        HideFiles: rest.HideFiles ? "" : undefined,
        Path: rest.Path ? rest.Path : undefined,
        sort: rest.sort?.length ? sortToUrl(rest.sort) : undefined,
        ShowHiddenFiles: rest.ShowHiddenFiles ? "" : undefined,
        NoCache: rest.NoCache ? "" : undefined,
        View: rest.View ? rest.View : undefined,
        hideWatched: rest.hideWatched ? "" : undefined,
        KeepView: rest.KeepView ? "" : undefined,
        skip: rest.skip ? rest.skip : undefined,
        take: rest.take ? rest.take : undefined,
    }
    const q = new URLSearchParams(withoutUndefineds(obj))
    return sanitizeQuery(q.toString())
}

function sanitizeQuery(s: string): string {
    return s.replace(/=&/g, "&").replace(/=$/g, "").replace(/%2C/g, ",")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withoutUndefineds(obj: any): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj2 = {} as any
    for (const key of Object.keys(obj)) {
        if (obj[key] != undefined) {
            obj2[key] = obj[key]
        }
    }
    return obj2
}
