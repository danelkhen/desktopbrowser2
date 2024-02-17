import { is } from "@electron-toolkit/utils"
import express from "express"
import proxy from "express-http-proxy"
import http from "http"
import os from "os"
import path, { join } from "path"
import { AppDb } from "./AppDb"
import { createApi } from "./api/createApi"
import { dataDir } from "./rootDir"
import { LevelDb } from "./utils/LevelDb"
import { handleServiceRequest } from "./utils/handleServiceRequest"
import { setupWebsockets } from "./utils/websocket"

export async function main() {
    console.log(dataDir)

    console.log("os", JSON.stringify(os.platform()))
    process.on("uncaughtException", e => console.log("uncaughtException", e))

    //    const database = path.join(dataDir, "db.sqlite")
    const database2 = path.join(dataDir, "db.level")

    const levelDb = new LevelDb(database2)
    const appDb = new AppDb(levelDb)
    const fileService = createApi(appDb)

    const services = {
        fs: fileService,
    }

    const exp = express()
    exp.use(express.json())
    exp.use("/api/:service/:action", handleServiceRequest(services))
    console.log("renderer dir", join(__dirname, "../renderer"))

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        console.log("using proxy", process.env["ELECTRON_RENDERER_URL"])
        exp.use(proxy(process.env["ELECTRON_RENDERER_URL"]))
        // mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
    } else {
        exp.use("/", express.static(join(__dirname, "../renderer")))
        exp.use("/resources", express.static(join(__dirname, "../../resources")))
        // mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
    }

    // exp.use("/", express.static(path.join(rootDir, "client/dist")))
    // exp.use("/tmdb", express.static(path.join(rootDir, "tmdb")))
    // exp.use("/shared", express.static(path.join(rootDir, "shared")))
    // exp.use("/tmdb_proxy", proxy("api.themoviedb.org", {}))

    exp.get("/*", (req: express.Request, res: express.Response) => {
        // res.sendFile(path.join(rootDir, "client/dist/index.html"))
        res.sendFile(join(__dirname, "../renderer/index.html"))
    })

    const server = http.createServer(exp)
    setupWebsockets(server, { fileService })

    await new Promise<void>(resolve => server.listen(7779, resolve))

    console.log("server started: http://localhost:7779")
}
