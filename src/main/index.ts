import { electronApp, is } from "@electron-toolkit/utils"
import { app } from "electron"
import log from "electron-log/main"
import { baseUrl } from "./config"
import { migrateDb } from "./migrateDb"
import { setupAutoStart } from "./setup/setupAutoStart"
import { setupAutoUpdate } from "./setup/setupAutoUpdate"
import { setupDock } from "./setup/setupDock"
import { setupMainWindow } from "./setup/setupMainWindow"
import { setupShortcuts } from "./setup/setupShortcuts"
import { setupSingleInstance } from "./setup/setupSingleInstance"
import { setupTray } from "./setup/setupTray"
import { setupWebServer } from "./setup/setupWebServer"

void app.whenReady().then(async () => {
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
    await migrateDb()
    await setupWebServer()
    await setupMainWindow()
    await setupTray()
    await setupDock()
    setupAutoUpdate()
})
