import { app } from "electron"
import { showMainWindow } from "./setupMainWindow"

export function setupSecondInstance() {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
        return false
    }

    app.on("second-instance", () => {
        showMainWindow()
    })
    return true
}
