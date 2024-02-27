import { BrowserWindow, app, shell } from "electron"
import log from "electron-log/main"
import path from "path"
import icon from "../../../resources/icon.png?asset"
import { baseUrl } from "../config"

let quitting = false

export async function setupMainWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: path.join(__dirname, "../preload/index.js"),
            sandbox: false,
        },
        width: 300,
        height: 300,
        show: false,
        frame: true,
    })

    win.on("ready-to-show", () => {
        log.info("ready-to-show")
    })
    win.on("show", () => {
        log.info("show")
    })
    win.webContents.setWindowOpenHandler(details => {
        void shell.openExternal(details.url)
        return { action: "deny" }
    })

    app.on("before-quit", () => {
        console.log("before-quit")
        quitting = true
    })
    // mainWindow.on("closed", () => {
    //     mainWindow = null
    // })

    win.on("close", e => {
        if (quitting) {
            return
        }
        e.preventDefault()
        win.hide()
        app.emit("hide-window")
    })

    await win.loadURL(`${baseUrl}/tray`)
    console.log("loadURL finished")
    app.on("activate", () => {
        void showMainWindow()
    })
    return win
}

export async function showMainWindow() {
    log.info("showWindow")
    const win = await getCreateMainWindow()
    win.show()
    app.emit("show-window")
    return win
}

async function getCreateMainWindow() {
    let win = getMainWindow()
    if (!win) {
        win = await setupMainWindow()
    }
    return win
}
function getMainWindow() {
    const win = BrowserWindow.getAllWindows()[0]
    return win
}

// const position = getWindowPosition()
// console.log(position, mainWindow.getPosition())
// myWindow.setPosition(position.x, position.y, false)
// export const getWindowPosition = () => {
//     const windowBounds = mainWindow.getBounds()
//     const trayBounds = tray.getBounds()

//     // Center window horizontally below the tray icon
//     const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)

//     // Position window 4 pixels vertically below the tray icon
//     const y = Math.round(trayBounds.y + trayBounds.height + 4)

//     return { x: x, y: y }
// }
// // HMR for renderer base on electron-vite cli.
// // Load the remote URL for development or the local html file for production.
// if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
//     mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
// } else {
//     mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
// }
