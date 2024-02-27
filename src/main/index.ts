import { electronApp, is } from "@electron-toolkit/utils"
import { app } from "electron"
import log from "electron-log/main"
import { baseUrl } from "./baseUrl"
import { setupAutoStart } from "./setup/setupAutoStart"
import { setupMainWindow } from "./setup/setupMainWindow"
import { setupSingleInstance } from "./setup/setupSingleInstance"
import { setupShortcuts } from "./setup/setupShortcuts"
import { setupTray } from "./setup/setupTray"
import { setupWebServer } from "./setup/setupWebServer"
import { setupDock } from "./setup/setupDock"
import { setupAutoUpdate } from "./setup/setupAutoUpdate"

app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("danelkhen.desktopbrowser2")
    log.initialize()
    log.info({ baseUrl, dev: is.dev, ELECTRON_RENDERER_URL: process.env["ELECTRON_RENDERER_URL"] })

    if (!setupSingleInstance()) {
        return
    }
    setupAutoStart()

    // const menu = Menu.buildFromTemplate([])
    // Menu.setApplicationMenu(menu)

    setupShortcuts()

    await setupWebServer()
    await setupMainWindow()
    await setupTray()
    setupDock()
    setupAutoUpdate()
})
