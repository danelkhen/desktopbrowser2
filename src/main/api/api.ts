import { BrowserWindow, app, shell } from "electron"
import log from "electron-log/main"
import { autoUpdater } from "electron-updater"
import fs from "fs/promises"
import { rimraf } from "rimraf"
import { Api, FolderSelections } from "../../shared/Api"
import { IListFilesRes } from "../../shared/IListFilesRes"
import { vlcPlay } from "../lib/vlc"
import { db } from "../services"
import { getFile } from "./getFile"
import { getFileRelatives } from "./getFileRelatives"
import { getFiles } from "./getFiles"
import { toCurrentPlatformPath } from "./toCurrentPlatformPath"

export const api: Api = {
    getFolderSelection: key => {
        return db.folderSelection.get(key)
    },
    getAllFolderSelections: async () => {
        const list: FolderSelections = {}
        for await (const [key, file] of db.folderSelection.iterator()) {
            list[key] = file
        }
        return list
    },
    saveFolderSelection: async req => {
        await db.folderSelection.put(req.key, req.value)
    },
    deleteFolderSelection: async key => {
        await db.folderSelection.del(key)
    },
    listFiles: async req => {
        if (!req.path) {
            throw new Error("Path is required")
        }
        const file = await getFile({ path: req.path })

        if (!file?.isFolder) {
            const res: IListFilesRes = { file: file ?? undefined }
            return res
        }

        const files = await getFiles(req)
        const { next, parent, prev } = await getFileRelatives(req.path)
        const selections = await db.getFolderSelections(
            [parent, next, prev, file, ...files].filter(t => !!t).map(t => t!.name)
        )
        const res: IListFilesRes = {
            file: file ?? undefined,
            files: files,
            next,
            parent,
            prev,
            selections,
        }
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

    appInspect: async () => {
        const win = BrowserWindow.getFocusedWindow()
        win?.webContents.openDevTools({ mode: "detach" })
    },
    appOpen: () => {
        return shell.openExternal("http://localhost:7779")
    },
    appExit: async () => {
        return app.quit()
    },
    checkForUpdates: async () => {
        const res = await autoUpdater.checkForUpdatesAndNotify()
        return res
    },
    appGetVersion: async () => {
        return app.getVersion()
    },
    appHide: async () => {
        BrowserWindow.getAllWindows().forEach(t => t.hide())
    },
}
