import { is } from "@electron-toolkit/utils"
import { app } from "electron"

export const config = {
    dev: is.dev,
    ELECTRON_RENDERER_URL: process.env["ELECTRON_RENDERER_URL"],
    userDataDir: app.getPath("userData"),
}
export const baseUrl =
    config.dev && config.ELECTRON_RENDERER_URL ? config.ELECTRON_RENDERER_URL : `http://localhost:7779`
