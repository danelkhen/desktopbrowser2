/* eslint-disable @typescript-eslint/no-explicit-any */
import { Api, IVlcStatus } from "../../../shared/Api"
import { httpInvoke } from "../lib/getHttpInvoker"
import { wsInvoke, wsInvokeAsyncIterable, wsSetup } from "../lib/wsInvoke"

const wsClient = wsSetup()

export const wsApi = {
    vlcStatus: () => wsInvoke<IVlcStatus>("/api/vlcStatus"),
    onVlcStatusChanged: (e: IVlcStatus) => console.log("ws callback onVlcStatusChanged", e),
}
wsClient.onCallback = (name, args) => (wsApi as any)[name]?.(...args)
export const api: Api = {
    whenVlcStatusChange: () => wsInvoke("whenVlcStatusChange"),
    onVlcStatusChange: () => wsInvokeAsyncIterable("onVlcStatusChange"),
    vlcStatus: () => httpInvoke("/api/vlcStatus"),
    listFiles: req => httpInvoke("/api/listFiles", req),
    saveFolderSelection: req => httpInvoke("/api/saveFolderSelection", req),
    deleteFolderSelection: req => httpInvoke("/api/deleteFolderSelection", req),
    // getAllFolderSelections: () => httpInvoke("/api/getAllFolderSelections"),
    // getFolderSelection: req => httpInvoke("/api/getFolderSelection", req),
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
