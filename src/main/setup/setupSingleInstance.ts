import { app } from "electron"
import { showMainWindow } from "./setupMainWindow"

export function setupSingleInstance() {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
        app.quit()
        return false
    }

    app.on("second-instance", () => {
        void showMainWindow()
    })
    return true
}
