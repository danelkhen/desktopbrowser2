import express from "express"
import proxy from "express-http-proxy"
import http from "http"
import os from "os"
import { join } from "path"
import { api } from "../api/api"
import { WsApi } from "../api/WsApi"
import { config } from "../config"
import { handleServiceRequest } from "../lib/handleServiceRequest"
import { setupWebsockets } from "../lib/websocket"

export async function setupWebServer() {
    console.log(config)

    console.log("os", JSON.stringify(os.platform()))
    process.on("uncaughtException", e => console.log("uncaughtException", e))

    const exp = express()
    exp.use(express.json())
    exp.use("/api/:action", handleServiceRequest(api), () => {})
    exp.use("/api", () => {})

    console.log("renderer dir", join(__dirname, "../renderer"))

    if (config.dev && config.ELECTRON_RENDERER_URL) {
        console.log("dev mode - using proxy", config.ELECTRON_RENDERER_URL)
        exp.use(proxy(config.ELECTRON_RENDERER_URL))
    } else {
        exp.use("/", express.static(join(__dirname, "../renderer")))
        exp.get("/*", (req, res) => {
            res.sendFile(join(__dirname, "../renderer/index.html"))
        })
    }

    const server = http.createServer(exp)
    setupWebsockets(server, socket => {
        const client = new WsApi()
        client.onVlcStatusChanged = t => socket.callback("onVlcStatusChanged", t)
        socket.invoke("monitorVlcStatus", t => client.monitorVlcStatus(!!t))
        socket.destroy = () => client.destroy()
    })

    await new Promise<void>(resolve => server.listen(7779, resolve))

    console.log("server started: http://localhost:7779")
}
