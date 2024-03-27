import { useSyncExternalStore } from "react"
import { IVlcStatus } from "../../../shared/Api"
import { wsApi } from "../services/api"

interface State {
    vlcStatus: IVlcStatus
}
const store = {
    state: { vlcStatus: {} as IVlcStatus } as State,
    subscribe: (cb: () => void) => {
        store.listeners = [...store.listeners, cb]
        return () => {
            store.listeners = store.listeners.filter(t => t !== cb)
        }
    },
    getSnapshot: () => {
        return store.state
    },
    listeners: [] as (() => void)[],
    set(x: State) {
        this.state = x
        this.listeners.forEach(t => t())
    },
}
wsApi.onVlcStatusChanged = (e: IVlcStatus) => {
    store.set({ ...store.state, vlcStatus: e })
}

export function useVlcStatus() {
    const { vlcStatus } = useSyncExternalStore(store.subscribe, store.getSnapshot)
    return vlcStatus
}

// export function useVlcStatus2(vlc: boolean) {
//     const [vlcStatus, setVlcStatus] = useState<IVlcStatus>({})
//     useEffect(() => {
//         if (!vlc) return
//         let unmounted = false
//         void (async () => {
//             while (!unmounted) {
//                 // const res = (await api.vlcStatus().catch(() => null)) ?? {}
//                 const res = (await api.whenVlcStatusChange().catch(() => null)) ?? {}
//                 setVlcStatus(t => (_.isEqual(res, t) ? t : res))
//                 await sleep(5000)
//             }
//         })()
//         return () => {
//             unmounted = true
//         }
//     }, [vlc])
//     return vlcStatus
// }
