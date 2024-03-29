/* eslint-disable @typescript-eslint/no-explicit-any */
import { Api, IWsApi, IWsApiCallbacks } from "../../../shared/Api"
import { httpInvoke } from "../lib/getHttpInvoker"
import { wsSetup } from "../lib/wsInvoke"

export const wsClient = wsSetup<EventMap2<IWsApiCallbacks>>()
type EventMap2<T> = { [P in keyof T]: T[P] extends (...args: infer A) => void ? A : never }
// const x = new EventEmitter<EventMap2<IWsApiCallbacks>>()
// x.on("vlcStatusChanged", t => {t)
// export const vlcStatusChanged = new EventSource<IWsApiCallbacks["vlcStatusChanged"]>(t =>
//     wsApi.monitorVlcStatus(!!t.length)
// )
export const wsApi: IWsApi = {
    monitorVlcStatus: t => wsClient.invoke("monitorVlcStatus", t),
}
// export const wsApiCallbacks: IWsApiCallbacks = {
//     vlcStatusChanged: (e: IVlcStatus) => {
//         vlcStatusChanged.emit(e)
//     },
// }
// wsClient.on("vlcStatusChanged", t => wsApiCallbacks.vlcStatusChanged(t))

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
