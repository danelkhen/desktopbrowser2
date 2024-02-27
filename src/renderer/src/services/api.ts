import { httpInvoke } from "../lib/getHttpInvoker"
import { wsInvoke } from "../lib/wsInvoke"
import { Api } from "../../../shared/Api"

function proxyForFileService() {
    const proxy: Api = {
        listFiles: req => wsInvoke({ funcName: "listFiles", args: [req] }),
        saveFileMeta: req => httpInvoke("/api/saveFileMeta", req),
        getFileMeta: req => httpInvoke("/api/getFileMeta", req),
        deleteFileMeta: req => httpInvoke("/api/deleteFileMeta", req),
        getAllFilesMeta: () => httpInvoke("/api/getAllFilesMeta"),
        execute: req => httpInvoke("/api/execute", req),
        explore: req => httpInvoke("/api/explore", req),
        del: req => httpInvoke("/api/del", req),
        trash: req => httpInvoke("/api/trash", req),
        appInspect: () => httpInvoke("/api/appInspect"),
        appOpen: () => httpInvoke("/api/appOpen"),
        appExit: () => httpInvoke("/api/appExit"),
        checkForUpdates: () => httpInvoke("/api/checkForUpdates"),
        appGetVersion: () => httpInvoke("/api/appGetVersion"),
        appHide: () => httpInvoke("/api/appHide"),
    }

    return proxy
}

export const api = proxyForFileService()
