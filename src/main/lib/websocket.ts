/* eslint-disable @typescript-eslint/no-explicit-any */
import * as http from "http"
import * as ws from "ws"
import { IWsReq } from "../../shared/IWsReq"

export function setupWebsockets(server: http.Server, service: any) {
    console.log("setupWebsockets")
    const wss = new ws.WebSocketServer({ path: "/api", server })

    wss.on("connection", (ws, req) => {
        console.log("wss.onconnection", req.url)
        ws.on("message", async message => {
            try {
                const data = String(message)
                console.log("ws.message received", data)
                const pc = JSON.parse(data) as IWsReq // extractFunctionCall(data)
                const res = await service[pc.funcName](...pc.args)
                if (isIterable(res)) {
                    console.log("sending iterable!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for (const item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else if (isAsyncIterable(res)) {
                    console.log("sending async iterable!!!!!!!!!!!!!!!!!!")
                    ws.send("[")
                    for await (const item of res) {
                        ws.send(JSON.stringify(item) + ",")
                    }
                    ws.send("]")
                } else {
                    ws.send(JSON.stringify(res))
                }
            } catch (err) {
                console.log(err)
                ws.send("ERROR: " + JSON.stringify(err))
            }
        })
        ws.on("error", e => console.log("ws.error", e))
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isIterable(obj: any): obj is Iterable<unknown> {
    if (obj == null) return false
    return typeof obj[Symbol.iterator] === "function"
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isAsyncIterable(obj: any): obj is AsyncIterable<unknown> {
    if (obj == null) return false
    return typeof obj[Symbol.asyncIterator] === "function"
}
