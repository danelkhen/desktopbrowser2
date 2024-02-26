import { httpInvoke } from "../lib/getHttpInvoker"
import { wsInvoke } from "../lib/webSocket"
import { FileService } from "./FileService"

function proxyForFileService() {
    const proxy: FileService = {
        listFiles: req => wsInvoke({ target: ["fileService"], funcName: "listFiles", args: [req] }),
        saveFileMetadata: req => httpInvoke("/api/fs/saveFileMetadata", req),
        getFileMetadata: req => httpInvoke("/api/fs/getFileMetadata", req),
        deleteFileMetadata: req => httpInvoke("/api/fs/deleteFileMetadata", req),
        getAllFilesMetadata: () => httpInvoke("/api/fs/getAllFilesMetadata"),
        execute: req => httpInvoke("/api/fs/execute", req),
        explore: req => httpInvoke("/api/fs/explore", req),
        del: req => httpInvoke("/api/fs/del", req),
        trash: req => httpInvoke("/api/fs/trash", req),
        appInspect: () => httpInvoke("/api/fs/appInspect"),
        appOpen: () => httpInvoke("/api/fs/appOpen"),
        appExit: () => httpInvoke("/api/fs/appExit"),
        checkForUpdates: () => httpInvoke("/api/fs/checkForUpdates"),
        appGetVersion: () => httpInvoke("/api/fs/appGetVersion"),
        appHide: () => httpInvoke("/api/fs/appHide"),
    }

    return proxy
}

export const api = proxyForFileService()
