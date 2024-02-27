import express from "express"
import http from "http"
import os from "os"
import { join } from "path"
import { config } from "../config"
import { handleServiceRequest } from "../lib/handleServiceRequest"
import { setupWebsockets } from "../lib/websocket"
import { api } from "../api/api"

export async function setupWebServer() {
    console.log(config)

    console.log("os", JSON.stringify(os.platform()))
    process.on("uncaughtException", e => console.log("uncaughtException", e))

    const exp = express()
    exp.use(express.json())
    exp.use("/api/:action", handleServiceRequest(api))
    console.log("renderer dir", join(__dirname, "../renderer"))

    if (config.dev && config.ELECTRON_RENDERER_URL) {
        console.log("using proxy", config.ELECTRON_RENDERER_URL)
        // exp.use(proxy(config.ELECTRON_RENDERER_URL))
        // mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
    } else {
        exp.use("/", express.static(join(__dirname, "../renderer")))
        exp.use("/resources", express.static(join(__dirname, "../../resources")))
        // mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
    }

    exp.get("/*", (req: express.Request, res: express.Response) => {
        // res.sendFile(path.join(rootDir, "client/dist/index.html"))
        res.sendFile(join(__dirname, "../renderer/index.html"))
    })

    const server = http.createServer(exp)
    setupWebsockets(server, api)

    await new Promise<void>(resolve => server.listen(7779, resolve))

    console.log("server started: http://localhost:7779")
}
