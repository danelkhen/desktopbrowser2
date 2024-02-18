import { is } from "@electron-toolkit/utils"

export const baseUrl =
    is.dev && process.env["ELECTRON_RENDERER_URL"] ? process.env["ELECTRON_RENDERER_URL"] : `http://localhost:7779`
