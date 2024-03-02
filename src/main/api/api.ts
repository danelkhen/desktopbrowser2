import { BrowserWindow, app, shell } from "electron"
import { autoUpdater } from "electron-updater"
import { Api } from "../../shared/Api"
import { IFileMeta } from "../../shared/IFileMeta"
import { IListFilesRes } from "../../shared/IListFilesRes"
import { io } from "../io/io"
import { db } from "../services"
import { getFile } from "./getFile"
import { getFileRelatives } from "./getFileRelatives"
import { getFiles } from "./getFiles"
import { toCurrentPlatformPath } from "./toCurrentPlatformPath"

export const api: Api = {
    getFileMeta({ key }) {
        return db.files.get(key)
    },
    async getAllFilesMeta() {
        const list: IFileMeta[] = []
        for await (const [key, file] of db.files.iterator()) {
            list.push({ ...file, key })
        }
        return list
    },
    async saveFileMeta(req) {
        await db.files.put(req.key, req)
    },
    async deleteFileMeta({ key }) {
        await db.files.del(key)
    },
    listFiles: async req => {
        if (!req.path) {
            throw new Error("Path is required")
        }
        const file = await getFile({ path: req.path })

        if (file?.IsFolder) {
            const files = await getFiles(req)
            const { NextSibling, ParentFolder, PreviousSibling } = await getFileRelatives(req.path)
            const res: IListFilesRes = {
                file: file ?? undefined,
                files: files,
                next: NextSibling,
                parent: ParentFolder,
                prev: PreviousSibling,
            }
            return res
        }
        const res: IListFilesRes = { file: file ?? undefined }
        return res
    },
    execute: async req => {
        const filename = toCurrentPlatformPath(req.path)
        await shell.openExternal(filename)
    },
    explore: async req => {
        console.log("shell.showItemInFolder", req.path)
        await shell.showItemInFolder(toCurrentPlatformPath(req.path))
    },
    del: async req => {
        const path = toCurrentPlatformPath(req.path)
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
        const path = toCurrentPlatformPath(req.path)
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
