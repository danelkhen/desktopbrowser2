import { BrowserWindow, app, shell } from "electron"
import log from "electron-log/main"
import { autoUpdater } from "electron-updater"
import fs from "fs/promises"
import { rimraf } from "rimraf"
import { Api } from "../../shared/Api"
import { IFileMeta } from "../../shared/IFileMeta"
import { IListFilesRes } from "../../shared/IListFilesRes"
import { vlcPlay } from "../lib/vlc"
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

        if (file?.isFolder) {
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
        if (req.vlc) {
            log.log("vlcPlay", req.path, filename)
            await vlcPlay(filename)
            return
        }
        log.log("shell.openExternal", req.path, filename)
        await shell.openExternal(filename)
    },
    explore: async req => {
        const p = toCurrentPlatformPath(req.path)
        log.log("shell.showItemInFolder", req.path, p)
        await shell.showItemInFolder(p)
    },
    del: async req => {
        const path = toCurrentPlatformPath(req.path)
        const stat = await fs.lstat(path).catch(() => null)
        if (!stat) return
        if (await stat.isFile()) {
            await fs.unlink(path)
            return
        }
        if (await stat.isDirectory()) {
            if (path.split("/").length <= 2)
                throw new Error(
                    "Delete protection, cannot delete path so short, should be at least depth of 3 levels or more"
                )
            await rimraf(path, { glob: false })
        }
    },
    trash: async req => {
        const path = toCurrentPlatformPath(req.path)
        log.log("trash", req.path, path)
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
