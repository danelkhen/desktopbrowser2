import { electronApp, optimizer } from "@electron-toolkit/utils"
import { app, ipcMain } from "electron"
import path from "path"
import { setupWebServer } from "./setupWebServer"
import { setupTray } from "./setupTray"
import { setupAutoUpdate } from "./setupAutoUpdate"

const appFolder = path.dirname(process.execPath)
const updateExe = path.resolve(appFolder, "..", "Update.exe")
const exeName = path.basename(process.execPath)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("com.electron")

    if (app.isPackaged) {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: updateExe,
            args: ["--processStart", `"${exeName}"`, "--process-start-args", '"--hidden"'],
        })
    }

    app.dock?.hide()

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on("ping", () => console.log("pong"))

    await setupTray()

    // app.on("activate", function () {
    //     // On macOS it's common to re-create a window in the app when the
    //     // dock icon is clicked and there are no other windows open.
    //     if (BrowserWindow.getAllWindows().length === 0) createWindow()
    // })
    await setupWebServer()
    setupAutoUpdate()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})
