/* eslint-disable @typescript-eslint/no-explicit-any */
import ReconnectingWebSocket from "reconnecting-websocket"
import { IWsReq, IWsRes } from "../../../shared/IWsReq"

let webSocket: ReconnectingWebSocket

main()
export function main() {
    const url = new URL(location.href)
    url.search = ""
    url.protocol = "ws:"
    url.pathname = "/api"
    webSocket = new ReconnectingWebSocket(url.toString(), ["protocolOne", "protocolTwo"])
}

let id = 0
export async function wsInvoke<T>(name: string, arg?: unknown): Promise<T> {
    const pc: IWsReq = { name, args: arg === undefined ? [] : [arg], id: (++id).toString() }
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
