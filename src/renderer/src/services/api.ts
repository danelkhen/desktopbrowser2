/* eslint-disable @typescript-eslint/no-explicit-any */
import { Api, IVlcStatus, IWsApi } from "../../../shared/Api"
import { httpInvoke } from "../lib/getHttpInvoker"
import { wsSetup } from "../lib/wsInvoke"
import { EventSource } from "./EventSource"

const wsClient = wsSetup()

const vlcStatusChanged = new EventSource<IWsApi["onVlcStatusChanged"]>(t => wsApi.monitorVlcStatus(!!t.length))
export const wsApi: IWsApi = {
    monitorVlcStatus: t => wsClient.invoke("monitorVlcStatus", t),
    onVlcStatusChanged: (e: IVlcStatus) => {
        vlcStatusChanged.emit(e)
    },
}
wsClient.onCallback("onVlcStatusChanged", t => wsApi.onVlcStatusChanged(t))

export const api: Api = {
    vlcStatus: () => httpInvoke("/api/vlcStatus"),
    listFiles: req => httpInvoke("/api/listFiles", req),
    saveFolderSelection: req => httpInvoke("/api/saveFolderSelection", req),
    deleteFolderSelection: req => httpInvoke("/api/deleteFolderSelection", req),
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
