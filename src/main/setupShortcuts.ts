import { optimizer } from "@electron-toolkit/utils"
import { app } from "electron"

/**
 * Default open or close DevTools by F12 in development
 * and ignore CommandOrControl + R in production.
 * see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
 **/
export function setupShortcuts() {
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })
}
