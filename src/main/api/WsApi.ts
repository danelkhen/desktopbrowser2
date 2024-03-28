import _ from "lodash"
import { IVlcStatus } from "../../shared/Api"
import { sleep } from "../lib/sleep"
import { api } from "./api"

export class WsApi {
    lastStatus: IVlcStatus | null = null
    monitorVlcStatusEnabled = false
    onVlcStatusChanged?: (e: IVlcStatus) => void
    async monitorVlcStatus(enabled: boolean) {
        enabled = !!enabled
        if (this.monitorVlcStatusEnabled === enabled) return
        this.monitorVlcStatusEnabled = enabled
        while (this.monitorVlcStatusEnabled && !this.destroyed) {
            const status = await api.vlcStatus()
            if (!_.isEqual(status, this.lastStatus)) {
                this.lastStatus = status
                this.onVlcStatusChanged?.(this.lastStatus)
            }
            await sleep(500)
        }
    }
    destroyed = false
    destroy() {
        this.destroyed = true
    }
}
