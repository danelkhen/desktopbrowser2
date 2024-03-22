import { Api } from "../../../shared/Api"
import { httpInvoke } from "../lib/getHttpInvoker"

export const api: Api = {
    // listFilesWs: req => wsInvoke({ funcName: "listFiles", args: [req] }),
    listFiles: req => httpInvoke("/api/listFiles", req),
    saveFolderSelection: req => httpInvoke("/api/saveFolderSelection", req),
    deleteFolderSelection: req => httpInvoke("/api/deleteFolderSelection", req),
    getAllFolderSelections: () => httpInvoke("/api/getAllFolderSelections"),
    getFolderSelection: req => httpInvoke("/api/getFolderSelection", req),
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
