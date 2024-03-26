/* eslint-disable @typescript-eslint/no-explicit-any */
import log from "electron-log/main"
import http from "http"
import * as ws from "ws"
import { IWsReq, IWsRes } from "../../shared/IWsReq"

export function setupWebsockets<T>(server: http.Server, serviceFactory: () => T) {
    log.info("setupWebsockets")
    const wss = new ws.WebSocketServer({ noServer: true })

    wss.on("connection", (ws, req) => {
        const service = serviceFactory() as unknown as { [key: string]: (...args: unknown[]) => unknown }
        log.info("wss.onconnection", req.url)
        ws.on("message", async message => {
            try {
                const data = String(message)
                log.info("ws.message received", data)
                const pc = JSON.parse(data) as IWsReq // extractFunctionCall(data)
                const res = await service[pc.name]!(...pc.args)
                const res2: IWsRes = { id: pc.id, value: res }
                // if (isIterable(res)) {
                //     log.info("sending iterable!!!!!!!!!!!!!!!!")
                //     ws.send("[")
                //     for (const item of res) {
                //         ws.send(JSON.stringify(item) + ",")
                //     }
                //     ws.send("]")
                // } else if (isAsyncIterable(res)) {
                //     log.info("sending async iterable!!!!!!!!!!!!!!!!!!")
                //     ws.send("[")
                //     for await (const item of res) {
                //         ws.send(JSON.stringify(item) + ",")
                //     }
                //     ws.send("]")
                // } else {
                ws.send(JSON.stringify(res2))
                // }
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
