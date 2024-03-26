import { IListFilesReq } from "../../../shared/IListFilesReq"
import { pathToUrl } from "../lib/pathToUrl"
import { IFileBrowserQuery, queryToReq } from "../lib/queryToReq"
import { reqToQuery } from "../lib/reqToQuery"

export function parseRequest(pathname: string, search: string) {
    const req2 = queryToReq(search)
    const req: IFileBrowserQuery = { ...req2, path: decodeURIComponent(pathname) }
    return req
}

export function requestToUrlParts(req: IListFilesReq) {
    const { path: Path, ...rest } = req
    return { pathname: pathToUrl(Path), search: reqToQuery(rest) }
}

export function requestToUrl(req: IListFilesReq) {
    const { pathname, search } = requestToUrlParts(req)
    return `${pathname}${search ? "?" + search : ""}`
}
export function toListFilesReq(req: IFileBrowserQuery) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, ...rest } = req
    return rest as IListFilesReq
}
