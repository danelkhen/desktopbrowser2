/* eslint-disable @typescript-eslint/no-explicit-any */
import ReconnectingWebSocket from "reconnecting-websocket"
import { IWsClient, IWsMessage, IWsReq, IWsRes } from "../../../shared/IWsReq"

let webSocket: ReconnectingWebSocket

export function wsSetup(): IWsClient {
    const handlers: Record<string, (arg: unknown) => void> = {}
    const client: IWsClient = {
        invoke: wsInvoke,
        onCallback: (name, handler) => {
            handlers[name] = handler
        },
    }
    const url = new URL(location.href)
    url.search = ""
    url.protocol = "ws:"
    url.pathname = "/api"
    webSocket = new ReconnectingWebSocket(url.toString(), ["protocolOne", "protocolTwo"])
    webSocket.addEventListener("message", e => {
        void (async () => {
            const msg = JSON.parse(e.data) as IWsMessage
            if (msg.type === "req") {
                const res = handlers[msg.name]?.(msg.arg)
                if (msg.oneWay) return
                const res2: IWsRes = { type: "res", id: msg.id, value: res }
                webSocket.send(JSON.stringify(res2))
            }
        })()
    })
    return client
}

let id = 0
export async function wsInvoke<T>(name: string, arg?: unknown): Promise<T> {
    const pc: IWsReq = { type: "req", name, arg, id: (++id).toString() }
    webSocket.send(JSON.stringify(pc))
    const res = await new Promise<IWsRes<T>>(resolve => {
        const onMessage = (e: MessageEvent) => {
            const res = JSON.parse(e.data) as IWsRes<T>
            if (res.id !== pc.id) return
            webSocket.removeEventListener("message", onMessage)
            resolve(res)
        }
        webSocket.addEventListener("message", onMessage)
    })
    return res.value
}

export async function* wsInvokeAsyncIterable<T>(name: string, arg?: unknown): AsyncIterable<T> {
    const pc: IWsReq = {
        type: "req",
        name,
        arg,
        id: (++id).toString(),
        asyncIterable: true,
    }
    webSocket.send(JSON.stringify(pc))

    let resolve: (value: IWsRes<T>) => void
    let promise = new Promise<IWsRes<T>>(r => (resolve = r))
    const onMessage = (e: MessageEvent) => {
        const res = JSON.parse(e.data) as IWsRes<T>
        if (res.id !== pc.id) return
        const resolve2 = resolve
        promise = new Promise<IWsRes<T>>(r => (resolve = r))
        resolve2(res)
    }
    while (true) {
        webSocket.addEventListener("message", onMessage)
        const res = await promise
        yield res.value
        if (!res.asyncIterable) break
        if (res.done) break
    }
    webSocket.removeEventListener("message", onMessage)
}

// export async function wsInvoke<T>(pc: IWsReq): Promise<T> {
//     for await (const res of invokeStreaming(pc)) {
//         return res as any
//     }
//     return undefined as any
// }

// export async function* invokeStreaming<T>(pc: IWsReq): AsyncIterableIterator<T> {
//     console.log(pc)
//     const events = send(JSON.stringify(pc))
//     for await (const data of events) {
//         if (data.startsWith("ERROR: ")) {
//             const json = data.substring("ERROR: ".length)
//             if (json.length > 0) {
//                 // TODO: const x = JSON.parse(json)
//             }
//             throw new Error(data)
//         } else if (data === "[") {
//             //
//         } else if (data.endsWith(",")) {
//             const item = JSON.parse(data.substring(0, data.length - 1))
//             yield item
//         } else if (data === "]") {
//             break
//         } else {
//             const item = JSON.parse(data) as T
//             yield item
//         }
//     }
// }

// export async function* send(cmd: string): AsyncIterableIterator<string> {
//     webSocket.send(cmd)
//     const events = iterateDomEvent<MessageEvent>(webSocket as any, "message") // TODO:
//     let iterable: boolean | null = null
//     for await (const e of events) {
//         const data = e.data
//         if (data === "[") {
//             if (iterable != null) throw new Error()
//             iterable = true
//             yield data
//         } else if (data.endsWith(",")) {
//             if (iterable !== true) throw new Error()
//             yield data
//         } else if (data === "]") {
//             if (iterable !== true) throw new Error()
//             yield data
//             break
//         } else if (data.startsWith === "ERROR: ") {
//             const err = JSON.parse(data.substr("ERROR: ".length))
//             throw new Error(err.message || err)
//         } else {
//             if (iterable === true) throw new Error()
//             yield data
//             break
//         }
//     }
// }
