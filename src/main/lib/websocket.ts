/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "electron-log/main"
import http from "http"
import * as ws from "ws"
import { IWsReq, IWsRes } from "../../shared/IWsReq"

type IWsListener = (pc: IWsReq) => unknown
export function setupWebsockets<T>(server: http.Server, serviceFactory: () => T) {
    log.info("setupWebsockets")
    const wss = new ws.WebSocketServer({ noServer: true })

    wss.on("connection", (ws, req) => {
        const service = serviceFactory() as unknown as { [key: string]: (...args: unknown[]) => unknown }
        log.info("wss.onconnection", req.url)

        let listeners: IWsListener[] = []
        function addOnReq(listener: IWsListener) {
            listeners = [...listeners, listener]
            return () => {
                listeners = listeners.filter(x => x !== listener)
            }
        }
        async function onReq(pc: IWsReq) {
            for (const listener of listeners) {
                await listener(pc)
            }
        }
        addOnReq(async pc => {
            if (pc.return) return
            const res = await service[pc.name]!(...pc.args)
            const res2: IWsRes = { id: pc.id, value: res }
            if (isAsyncIterable(res)) {
                let pc2 = null as IWsReq | null
                const off = addOnReq(pc => {
                    if (pc.id === pc.id) {
                        pc2 = pc
                    }
                })
                for await (const item of res) {
                    const res3: IWsRes = { id: pc.id, value: item, asyncIterable: true, done: false }
                    ws.send(JSON.stringify(res3))
                    if (pc2?.return) break
                }
                off()
                const res4: IWsRes = { id: pc.id, value: null, asyncIterable: true, done: true }
                ws.send(JSON.stringify(res4))
            } else {
                ws.send(JSON.stringify(res2))
            }
        })
        ws.on("message", async message => {
            try {
                const data = String(message)
                log.info("ws.message received", data)
                const pc = JSON.parse(data) as IWsReq // extractFunctionCall(data)
                await onReq(pc)
            } catch (err) {
                log.warn(err)
                ws.send("ERROR: " + JSON.stringify(err))
            }
        })
        ws.on("close", async () => {
            await service["destroy"]?.()
            log.info("ws.close")
        })
        ws.on("error", e => log.info("ws.error", e))
    })
    server.on("upgrade", (request, socket, head) => {
        console.log("server.onupgrade", request.url)
        if (request.url !== "/api") {
            return
        }
        wss.handleUpgrade(request, socket, head, ws => {
            wss.emit("connection", ws, request)
        })
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isIterable(obj: any): obj is Iterable<unknown> {
    if (obj === null) return false
    return typeof obj[Symbol.iterator] === "function"
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isAsyncIterable(obj: any): obj is AsyncIterable<unknown> {
    if (obj === null) return false
    return typeof obj[Symbol.asyncIterator] === "function"
}

// function test() {
//     let xx = 0
//     return {
//         [Symbol.asyncIterator]: () => {
//             const x /*: AsyncIterator<number>*/ = {
//                 next: async () => {
//                     console.log("next")
//                     return { value: ++xx }
//                 },
//                 return: async () => {
//                     console.log("return")
//                     return { value: ++xx }
//                 },
//                 throw: async () => {
//                     console.log("throw")
//                     return { value: ++xx }
//                 },
//             }
//             return x
//         },
//     }
// }
// async function test2() {
//     let i = 0
//     for await (const x of test()) {
//         i++
//         console.log("test2", x)
//         if (i > 10) return
//     }
// }
