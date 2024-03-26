import { IListFilesReq } from "../../../shared/IListFilesReq"
import { urlToSort } from "@renderer/lib/sortToUrl"
import { IReqQuery } from "./IReqQuery"

export interface IFileBrowserQuery extends IListFilesReq {
    page?: number
}
export function queryToReq(s: string): IFileBrowserQuery {
    const rest = Object.fromEntries(new URLSearchParams(s).entries()) as IReqQuery
    const x: IFileBrowserQuery = {
        page: rest.page ? +rest.page! : undefined,
        foldersFirst: rest.foldersFirst === "" ? true : undefined,
        searchPattern: rest.search ?? undefined,
        recursive: rest.recursive === "" ? true : undefined,
        folderSize: rest.folderSize === "" ? true : undefined,
        hideFolders: rest.hideFolders === "" ? true : undefined,
        hideFiles: rest.hideFiles === "" ? true : undefined,
        sort: rest.sort ? urlToSort(rest.sort!) : undefined,
        hidden: rest.hidden === "" ? true : undefined,
        noCache: rest.noCache === "" ? true : undefined,
        view: rest.View ?? undefined,
        hideWatched: rest.hideWatched === "" ? true : undefined,
        keepView: rest.keepView === "" ? true : undefined,
        skip: rest.skip ? +rest.skip! : undefined,
        take: rest.take ? +rest.take! : undefined,
        vlc: rest.vlc === "" ? true : undefined,
    }

    return x
}
