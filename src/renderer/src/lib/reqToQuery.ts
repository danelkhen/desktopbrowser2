import { IListFilesReq } from "../../../shared/IListFilesReq"
import { sortToUrl } from "@renderer/lib/sortToUrl"

export function reqToQuery(rest: IListFilesReq) {
    console.log("reqToQuery", rest)
    const obj = {
        foldersFirst: rest.foldersFirst ? "" : undefined,
        // ByInnerSelection: rest.ByInnerSelection ? "" : undefined,
        SearchPattern: rest.searchPattern ? rest.searchPattern : undefined,
        IsRecursive: rest.recursive ? "" : undefined,
        FolderSize: rest.folderSize ? "" : undefined,
        HideFolders: rest.hideFolders ? "" : undefined,
        HideFiles: rest.hideFiles ? "" : undefined,
        Path: rest.path ? rest.path : undefined,
        sort: rest.sort?.length ? sortToUrl(rest.sort) : undefined,
        ShowHiddenFiles: rest.hidden ? "" : undefined,
        NoCache: rest.noCache ? "" : undefined,
        View: rest.view ? rest.view : undefined,
        hideWatched: rest.hideWatched ? "" : undefined,
        KeepView: rest.keepView ? "" : undefined,
        skip: rest.skip ? rest.skip : undefined,
        take: rest.take ? rest.take : undefined,
        vlc: rest.vlc ? "" : undefined,
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
