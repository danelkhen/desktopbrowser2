import { FileService } from "../shared/FileService"
import { ListFiles } from "./ListFiles"
import { AppDb } from "../AppDb"
import { Delete, Execute, Explore, trash } from "./api"
import { app, BrowserWindow, shell } from "electron"
import { autoUpdater } from "electron-updater"

export function createApi(db: AppDb): FileService {
    return {
        async getFileMetadata({ key }) {
            return db.files.get(key)
        },
        async getAllFilesMetadata() {
            return db.files.getAll()
        },
        async saveFileMetadata(req) {
            db.files.set(req)
        },
        async deleteFileMetadata({ key }) {
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
