import _ from "lodash"
import { IVlcStatus, IWsApi, IWsApiCallbacks } from "../../shared/Api"
import { sleep } from "../lib/sleep"
import { api } from "./api"

export function createWsApi(callbacks: IWsApiCallbacks) {
    let lastStatus: IVlcStatus | null = null
    let monitor = false
    let destroyed = false
    const wsApi: IWsApi = {
        monitorVlcStatus: async enabled => {
            enabled = !!enabled
            if (monitor === enabled) return
            monitor = enabled
            void (async () => {
                while (monitor && !destroyed) {
                    const status = await api.vlcStatus()
                    if (!_.isEqual(status, lastStatus)) {
                        lastStatus = status
                        callbacks.vlcStatusChanged?.(lastStatus)
                    }
                    await sleep(500)
                }
            })()
        },
    }
    return {
        ...wsApi,
        destroy: () => {
            destroyed = true
        },
    }
}
