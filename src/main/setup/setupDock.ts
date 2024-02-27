import { app } from "electron"
import log from "electron-log/main"

export async function setupDock() {
    if (!app.dock) return
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
}
