import { is } from "@electron-toolkit/utils"
import { app } from "electron"

export const config = {
    dev: is.dev,
    ELECTRON_RENDERER_URL: process.env["ELECTRON_RENDERER_URL"],
    userDataDir: app.getPath("userData"),
}
