import { IListFilesReq } from "../../../shared/IListFilesReq"
import { pathToUrl } from "../lib/pathToUrl"
import { queryToReq } from "../lib/queryToReq"
import { reqToQuery } from "../lib/reqToQuery"

export function parseRequest(pathname: string, search: string) {
    const req2: IListFilesReq = queryToReq(search)
    const req: IListFilesReq = { ...req2, path: decodeURIComponent(pathname) }
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
