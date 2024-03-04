/* eslint-disable @typescript-eslint/no-explicit-any */
import * as http from "http"
import * as ws from "ws"
import { IWsReq } from "../../shared/IWsReq"
import log from "electron-log/main"

export function setupWebsockets(server: http.Server, service: any) {
    log.info("setupWebsockets")
    const wss = new ws.WebSocketServer({ path: "/api", server })

    wss.on("connection", (ws, req) => {
        log.info("wss.onconnection", req.url)
        ws.on("message", async message => {
            try {
                const data = String(message)
                log.info("ws.message received", data)
                const pc = JSON.parse(data) as IWsReq // extractFunctionCall(data)
                const res = await service[pc.funcName](...pc.args)
                if (isIterable(res)) {
                    log.info("sending iterable!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for (const item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else if (isAsyncIterable(res)) {
                    log.info("sending async iterable!!!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for await (const item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else {
                    ws.send(JSON.stringify(res))
                }
            } catch (err) {
                log.warn(err)
                ws.send("ERROR: " + JSON.stringify(err))
            }
        })
        ws.on("error", e => log.info("ws.error", e))
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIterable(obj: any): obj is Iterable<unknown> {
    if (obj === null) return false
    return typeof obj[Symbol.iterator] === "function"
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAsyncIterable(obj: any): obj is AsyncIterable<unknown> {
    if (obj === null) return false
    return typeof obj[Symbol.asyncIterator] === "function"
}
