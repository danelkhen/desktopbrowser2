import { BrowserWindow, Tray, shell } from "electron"
import path from "path"
import trayIcon from "../../resources/clapperboard-16x16.png?asset"
import icon from "../../resources/icon.png?asset"

let mainWindow: BrowserWindow = null!
let tray: Tray = null!

export function setupTray() {
    createWindow()
    tray = new Tray(trayIcon)
    tray.on("click", showWindow)
}
export function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        // width: 900,
        // height: 670,
        // show: false,
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
        fullscreenable: false,
    })

    mainWindow.on("ready-to-show", () => {
        mainWindow.show()
    })

    mainWindow.webContents.setWindowOpenHandler(details => {
        shell.openExternal(details.url)
        return { action: "deny" }
    })

    mainWindow.loadURL("http://localhost:7779/tray")

    // // HMR for renderer base on electron-vite cli.
    // // Load the remote URL for development or the local html file for production.
    // if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    //     mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
    // } else {
    //     mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
    // }
}
export const showWindow = () => {
    const position = getWindowPosition()
    console.log(position, mainWindow.getPosition())
    // myWindow.setPosition(position.x, position.y, false)
    mainWindow.show()
    mainWindow.focus()
}

export const getWindowPosition = () => {
    const windowBounds = mainWindow.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}
