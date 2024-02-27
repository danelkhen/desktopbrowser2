import { httpInvoke } from "../lib/getHttpInvoker"
import { wsInvoke } from "../lib/webSocket"
import { Api } from "../../../shared/Api"

function proxyForFileService() {
    const proxy: Api = {
        listFiles: req => wsInvoke({ funcName: "listFiles", args: [req] }),
        saveFileMeta: req => httpInvoke("/api/saveFileMetadata", req),
        getFileMeta: req => httpInvoke("/api/getFileMetadata", req),
        deleteFileMeta: req => httpInvoke("/api/deleteFileMetadata", req),
        getAllFilesMeta: () => httpInvoke("/api/getAllFilesMetadata"),
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
