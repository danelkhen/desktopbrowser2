import { app } from "electron"
import log from "electron-log/main"

// let activated = false
// export async function updateDock() {
//     if (!app.dock) return
//     if (!activated) return
//     const hasVisibleWindows = BrowserWindow.getAllWindows().some(t => t.isVisible())
//     if (hasVisibleWindows) {
//         if (app.dock.isVisible()) return
//         await app.dock.show()
//         app.dock.bounce()
//     }
//     if (!app.dock.isVisible()) return
//     app.dock.hide()
// }
export async function setupDock() {
    if (!app.dock) return
    // app.on("activate", async () => {
    //     activated = true
    // })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.on("show-window" as any, async () => {
        log.info("show-window")
        await app.dock.show()
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app.on("hide-window" as any, () => {
        log.info("hide-window")
        app.dock.hide()
    })
    // app.on("browser-window-created", async (_, window) => {
    //     log.info("browser-window-created")
    //     await updateDock()
    //     window.on("show", async () => {
    //         log.info("show1")
    //         await updateDock()
    //     })
    //     window.on("hide", async () => {
    //         log.info("hide1")
    //         await updateDock()
    //     })
    // })
}
