// This is free and unencumbered software released into the public domain.
// See LICENSE for details

import { app, Menu, MenuItemConstructorOptions } from "electron"
import log from "electron-log/main"
import { autoUpdater } from "electron-updater"
import { mainWindow } from "./setupTray"

export async function setupAutoUpdate() {
    //-------------------------------------------------------------------
    // Logging
    //
    // THIS SECTION IS NOT REQUIRED
    //
    // This logging setup is not required for auto-updates to work,
    // but it sure makes debugging easier :)
    //-------------------------------------------------------------------
    autoUpdater.logger = log
    log.transports.file.level = "info"
    log.info("App starting...")

    //-------------------------------------------------------------------
    // Define the menu
    //
    // THIS SECTION IS NOT REQUIRED
    //-------------------------------------------------------------------
    const template: MenuItemConstructorOptions[] = []
    if (process.platform === "darwin") {
        // OS X
        const name = app.getName()
        template.unshift({
            label: name,
            submenu: [
                {
                    label: "About " + name,
                    role: "about",
                },
                {
                    label: "Quit",
                    accelerator: "Command+Q",
                    click() {
                        app.quit()
                    },
                },
            ],
        })
    }

    //-------------------------------------------------------------------
    // Open a window that displays the version
    //
    // THIS SECTION IS NOT REQUIRED
    //
    // This isn't required for auto-updates to work, but it's easier
    // for the app to show a window than to have to click "About" to see
    // that updates are working.
    //-------------------------------------------------------------------
    // let win: BrowserWindow | null = null

    function sendStatusToWindow(text: string) {
        log.info(text)
        mainWindow?.webContents.send("message", text)
    }
    // function createDefaultWindow() {
    //     win = new BrowserWindow({
    //         webPreferences: {
    //             nodeIntegration: true,
    //             contextIsolation: false,
    //         },
    //     })
    //     // win.webContents.openDevTools()
    //     win.on("closed", () => {
    //         win = null
    //     })
    //     const url = `${baseUrl}/tray#v${app.getVersion()}`
    //     log.info(url)
    //     win.loadURL(url)
    //     return win
    // }
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
    })
    app.whenReady().then(() => {
        // Create the Menu
        const menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)

        // createDefaultWindow()
    })
    // app.on("window-all-closed", () => {
    //     app.quit()
    // })

    //
    // CHOOSE one of the following options for Auto updates
    //

    //-------------------------------------------------------------------
    // Auto updates - Option 1 - Simplest version
    //
    // This will immediately download an update, then install when the
    // app quits.
    //-------------------------------------------------------------------
    app.whenReady().then(async () => {
        sendStatusToWindow(app.getVersion())
        log.info("checkForUpdatesAndNotify")
        const res = await autoUpdater.checkForUpdatesAndNotify()
        log.info("checkForUpdatesAndNotify res", res)
        sendStatusToWindow(JSON.stringify(res || "no res"))
        // await sleep(10000)
        // win?.close()
        // win = null
    })

    //-------------------------------------------------------------------
    // Auto updates - Option 2 - More control
    //
    // For details about these events, see the Wiki:
    // https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
    //
    // The app doesn't need to listen to any events except `update-downloaded`
    //
    // Uncomment any of the below events to listen for them.  Also,
    // look in the previous section to see them being used.
    //-------------------------------------------------------------------
    // app.on('ready', function()  {
    //   autoUpdater.checkForUpdates();
    // });
    // autoUpdater.on('checking-for-update', () => {
    // })
    // autoUpdater.on('update-available', (info) => {
    // })
    // autoUpdater.on('update-not-available', (info) => {
    // })
    // autoUpdater.on('error', (err) => {
    // })
    // autoUpdater.on('download-progress', (progressObj) => {
    // })
    // autoUpdater.on('update-downloaded', (info) => {
    //   autoUpdater.quitAndInstall();
    // })
}
