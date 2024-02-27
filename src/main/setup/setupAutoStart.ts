import { app } from "electron"

export function setupAutoStart() {
    if (!app.isPackaged) {
        return
    }
    app.setLoginItemSettings({
        openAtLogin: true,
    })
}
