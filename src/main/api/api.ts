import { BrowserWindow, app, shell } from "electron"
import { autoUpdater } from "electron-updater"
import { Api } from "../../shared/Api"
import { IListFilesRes } from "../../shared/IListFilesRes"
import { io } from "../io/io"
import { appDb } from "../services"
import { getFile } from "./getFile"
import { getFileRelatives } from "./getFileRelatives"
import { getFiles } from "./getFiles"

export const api: Api = {
    async getFileMeta({ key }) {
        return appDb.files.get(key)
    },
    async getAllFilesMeta() {
        return appDb.files.getAll()
    },
    async saveFileMeta(req) {
        appDb.files.set(req)
    },
    async deleteFileMeta({ key }) {
        appDb.files.del(key)
    },
    listFiles: async req => {
        if (!req.path) {
            throw new Error("Path is required")
        }
        const file = await getFile({ path: req.path })

        if (file?.IsFolder) {
            const files = await getFiles(req)
            const relatives = await getFileRelatives(req.path)
            const res: IListFilesRes = { Relatives: relatives, File: file ?? undefined, Files: files }
            return res
        }
        const res: IListFilesRes = { File: file ?? undefined, Relatives: {} }
        return res
    },
    execute: async req => {
        const filename = req.path
        await shell.openExternal(filename)
    },
    explore: async req => {
        console.log("shell.showItemInFolder", req.path)
        await shell.showItemInFolder(req.path)
    },
    del: async req => {
        const path = req.path
        if (await io.fileExists(path)) {
            await io.delete(path)
            return
        }
        if (await io.dirExists(path)) {
            if (path.split("/").length <= 2)
                throw new Error(
                    "Delete protection, cannot delete path so short, should be at least depth of 3 levels or more"
                )
            await io.del(path)
        }
    },
    trash: async req => {
        const path = req.path
        console.log("trash", path)
        await shell.trashItem(path)
    },

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
