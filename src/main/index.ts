import { electronApp, is } from "@electron-toolkit/utils"
import { app } from "electron"
import log from "electron-log/main"
import { baseUrl } from "./baseUrl"
import { setupAutoStart } from "./setupAutoStart"
import { setupMainWindow } from "./setupMainWindow"
import { setupSecondInstance } from "./setupSecondInstance"
import { setupShortcuts } from "./setupShortcuts"
import { setupTray } from "./setupTray"
import { setupWebServer } from "./setupWebServer"
import { setupDock } from "./setupDock"
import { setupAutoUpdate } from "./setupAutoUpdate"

app.whenReady().then(async () => {
    // Set app user model id for windows
    electronApp.setAppUserModelId("danelkhen.desktopbrowser2")
    log.initialize()
    log.info({ baseUrl, dev: is.dev, ELECTRON_RENDERER_URL: process.env["ELECTRON_RENDERER_URL"] })

    if (!setupSecondInstance()) {
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
