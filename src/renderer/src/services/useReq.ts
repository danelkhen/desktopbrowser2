import { useMemo } from "react"
import { useLocation } from "react-router-dom"
import { parseRequest } from "../components/parseRequest"

// export const dispatcher = new Dispatcher()

export function useReq() {
    const { pathname, search } = useLocation()
    const req = useMemo(() => parseRequest(pathname, search), [pathname, search])
    return req
}
