import { sortToUrl } from "@renderer/lib/sortToUrl"
import { IReqQuery } from "./IReqQuery"
import { IFileBrowserQuery } from "./queryToReq"

export function reqToQuery(rest: IFileBrowserQuery) {
    // console.log("reqToQuery", rest)
    const obj: IReqQuery = {
        page: rest.page !== 1 ? rest.page?.toString() : undefined,
        foldersFirst: rest.foldersFirst ? "" : undefined,
        search: rest.searchPattern ? rest.searchPattern : undefined,
        recursive: rest.recursive ? "" : undefined,
        folderSize: rest.folderSize ? "" : undefined,
        hideFolders: rest.hideFolders ? "" : undefined,
        hideFiles: rest.hideFiles ? "" : undefined,
        // Path: rest.path ? rest.path : undefined,
        sort: rest.sort && Object.keys(rest.sort).length ? sortToUrl(rest.sort) : undefined,
        hidden: rest.hidden ? "" : undefined,
        noCache: rest.noCache ? "" : undefined,
        View: rest.view ? rest.view : undefined,
        hideWatched: rest.hideWatched ? "" : undefined,
        keepView: rest.keepView ? "" : undefined,
        skip: rest.skip?.toString(),
        take: rest.take?.toString(),
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
        if (obj[key] !== undefined) {
            obj2[key] = obj[key]
        }
    }
    return obj2
}
