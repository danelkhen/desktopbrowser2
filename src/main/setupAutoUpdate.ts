// This is free and unencumbered software released into the public domain.
// See LICENSE for details

import { app } from "electron"
import log from "electron-log/main"
import { autoUpdater } from "electron-updater"
import { showMainWindow } from "./setupMainWindow"

export function setupAutoUpdate() {
    autoUpdater.logger = log
    // log.transports.file.level = "info"
    log.info("App starting...")

    async function sendStatusToWindow(text: string) {
        log.info(text)
        const win = await showMainWindow()
        win.webContents.send("message", text)
    }
    autoUpdater.on("checking-for-update", () => {
        sendStatusToWindow("Checking for update...")
    })
    autoUpdater.on("update-available", () => {
        sendStatusToWindow("Update available.")
    })
    autoUpdater.on("update-not-available", () => {
        sendStatusToWindow("Update not available.")
    })
    autoUpdater.on("error", err => {
        sendStatusToWindow("Error in auto-updater. " + err)
    })
    autoUpdater.on("download-progress", progressObj => {
        let log_message = "Download speed: " + progressObj.bytesPerSecond
        log_message = log_message + " - Downloaded " + progressObj.percent + "%"
        log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")"
        sendStatusToWindow(log_message)
    })
    autoUpdater.on("update-downloaded", () => {
        sendStatusToWindow("Update downloaded")
        sendStatusToWindow("Quitting and installing...")
        autoUpdater.quitAndInstall(true, true)
    })
    app.whenReady().then(async () => {
        sendStatusToWindow(app.getVersion())
        log.info("checkForUpdatesAndNotify")
        const res = await autoUpdater.checkForUpdatesAndNotify()
        log.info("checkForUpdatesAndNotify result", res)
        sendStatusToWindow(JSON.stringify(res || "no res"))
    })
}
