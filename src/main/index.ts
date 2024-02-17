import { electronApp, optimizer } from "@electron-toolkit/utils"
import { BrowserWindow, Tray, app, ipcMain, shell } from "electron"
import path, { join } from "path"
import icon from "../../resources/icon.png?asset"
import { main } from "./main"

import trayIcon from "../../resources/clapperboard-16x16.png?asset"

const appFolder = path.dirname(process.execPath)
const updateExe = path.resolve(appFolder, "..", "Update.exe")
const exeName = path.basename(process.execPath)

let mainWindow: BrowserWindow = null!
let tray: Tray = null!

function createWindow(): void {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        // width: 900,
        // height: 670,
        // show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
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

    // // HMR for renderer base on electron-vite cli.
    // // Load the remote URL for development or the local html file for production.
    // if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    //     mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
    // } else {
    //     mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
    // }

    tray = new Tray(trayIcon)
    // tray.on("right-click", toggleWindow)
    // tray.on("double-click", toggleWindow)
    mainWindow = new BrowserWindow({
        width: 300,
        height: 300,
        show: false,
        frame: true,
        fullscreenable: false,
    })
    mainWindow.loadURL("http://localhost:7779/tray")

    tray.on("click", showWindow)
}

const showWindow = () => {
    const position = getWindowPosition()
    console.log(position, mainWindow.getPosition())
    // myWindow.setPosition(position.x, position.y, false)
    mainWindow.show()
    mainWindow.focus()
}
const getWindowPosition = () => {
    const windowBounds = mainWindow.getBounds()
    const trayBounds = tray.getBounds()

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2)

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4)

    return { x: x, y: y }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    if (app.isPackaged) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: updateExe,
            args: ["--processStart", `"${exeName}"`, "--process-start-args", '"--hidden"'],
        })
    }

    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron")
    app.dock?.hide()

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on("ping", () => console.log("pong"))

    createWindow()

    // app.on("activate", function () {
    //     // On macOS it's common to re-create a window in the app when the
    //     // dock icon is clicked and there are no other windows open.
    //     if (BrowserWindow.getAllWindows().length === 0) createWindow()
    // })
    await main()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
