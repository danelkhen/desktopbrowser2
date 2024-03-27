import _ from "lodash"
import { useEffect, useState } from "react"
import { IVlcStatus } from "../../../shared/Api"
import { sleep } from "../lib/sleep"
import { api } from "../services/api"

export function useVlcStatus(vlc: boolean) {
    const [vlcStatus, setVlcStatus] = useState<IVlcStatus>({})
    useEffect(() => {
        if (!vlc) return
        let unmounted = false
        void (async () => {
            for await (const res of api.onVlcStatusChange()) {
                if (unmounted) return
                setVlcStatus(res)
            }
        })()
        return () => {
            unmounted = true
        }
    }, [vlc])
    return vlcStatus
}

export function useVlcStatus2(vlc: boolean) {
    const [vlcStatus, setVlcStatus] = useState<IVlcStatus>({})
    useEffect(() => {
        if (!vlc) return
        let unmounted = false
        void (async () => {
            while (!unmounted) {
                // const res = (await api.vlcStatus().catch(() => null)) ?? {}
                const res = (await api.whenVlcStatusChange().catch(() => null)) ?? {}
                setVlcStatus(t => (_.isEqual(res, t) ? t : res))
                await sleep(5000)
            }
        })()
        return () => {
            unmounted = true
        }
    }, [vlc])
    return vlcStatus
}
