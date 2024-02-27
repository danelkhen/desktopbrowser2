import { Api } from "../../shared/Api"
import { ListFiles } from "./ListFiles"
import { AppDb } from "../AppDb"
import { Delete, Execute, Explore, trash } from "./api"
import { app, BrowserWindow, shell } from "electron"
import { autoUpdater } from "electron-updater"

export function createApi(db: AppDb): Api {
    return {
        async getFileMeta({ key }) {
            return db.files.get(key)
        },
        async getAllFilesMeta() {
            return db.files.getAll()
        },
        async saveFileMeta(req) {
            db.files.set(req)
        },
        async deleteFileMeta({ key }) {
            db.files.del(key)
        },
        listFiles: ListFiles,
        execute: Execute,
        explore: Explore,
        del: Delete,
        trash,

        async appInspect() {
            const win = BrowserWindow.getFocusedWindow()
            win?.webContents.openDevTools({ mode: "detach" })
        },
        appOpen() {
            return shell.openExternal("http://localhost:7779")
        },
        async appExit() {
            return app.quit()
        },
        async checkForUpdates() {
            const res = await autoUpdater.checkForUpdatesAndNotify()
            return res
        },
        async appGetVersion() {
            return app.getVersion()
        },
        async appHide() {
            BrowserWindow.getAllWindows().forEach(t => t.hide())
        },
    }
}
