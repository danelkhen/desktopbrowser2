import { BrowserWindow, app, shell } from "electron"
import log from "electron-log/main"
import { autoUpdater } from "electron-updater"
import fs from "fs/promises"
import path from "path"
import { rimraf } from "rimraf"
import url from "url"
import { Api, IVlcStatus } from "../../shared/Api"
import { IFile } from "../../shared/IFile"
import { IListFilesRes } from "../../shared/IListFilesRes"
import { isMediaFile } from "../../shared/isMediaFile"
import { VlcPlaylistNode, VlcStatus } from "../../shared/vlc"
import { connectToVlc, vlcPlay } from "../lib/vlc"
import { db } from "../services"
import { applyPaging } from "./applyPaging"
import { applyFiltersAndSorting, applySelectionFiltersAndFolderSizes } from "./applyRequest"
import { getFile } from "./getFile"
import { getFileRelatives } from "./getFileRelatives"
import { getFiles } from "./getFiles"
import { toCurrentPlatformPath } from "./toCurrentPlatformPath"

export const api: Api = {
    vlcStatus: async () => {
        const vlc = await connectToVlc()
        if (!vlc) return {}
        const [status, playlist] = (await vlc.updateAll()) as [VlcStatus | undefined, VlcPlaylistNode | undefined]
        if (!status) {
            return {}
        }
        const playlist2 = playlist?.children?.find(t => t.name === "Playlist")?.children
        const current = playlist2?.find(t => t.current)
        const path = current?.uri ? url.fileURLToPath(current.uri) : undefined
        const state = status?.state
        const position = status?.position

        const res: IVlcStatus = {
            running: true,
            path,
            position,
            playing: state === "playing",
            paused: state === "paused",
            stopped: state === "stopped",
        }
        return res
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
        const file = await getFile(req.path)
        if (!file) {
            const res: IListFilesRes = {
                fileNotFound: true,
                file: { name: path.posix.basename(req.path), isFolder: true, path: req.path },
                files: [],
                parent: {
                    name: path.posix.basename(path.posix.dirname(req.path)),
                    isFolder: true,
                    path: path.posix.dirname(req.path),
                },
            }
            return res
        }

        // if (!file?.isFolder) {
        //     const res: IListFilesRes = { file: file ?? undefined }
        //     return res
        // }

        const { next, parent, prev } = await getFileRelatives(req.path)
        let files: IFile[] = []
        if (file.isFolder) {
            files = await getFiles(req)
            files = await applyFiltersAndSorting(files, req)
        }
        const contextFiles = [parent, next, prev, file, ...files].filter(t => !!t) as IFile[]
        const selections = await db.getFolderSelections(contextFiles.map(t => t!.name))
        files = await applySelectionFiltersAndFolderSizes(files, req, selections)
        files = applyPaging(files, req)

        const res: IListFilesRes = {
            file: file,
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
        if (req.vlc && isMediaFile(filename)) {
            log.log("vlcPlay", req.path, filename)
            await vlcPlay(filename)
            return
        }
        log.log("shell.openExternal", req.path, filename)

        const url2 = process.platform === "win32" ? filename : url.pathToFileURL(filename).toString()
        await shell.openExternal(url2)
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

// whenVlcStatusChange = async () => {
//     while (!this.destroyed) {
//         const status = await api.vlcStatus()
//         if (!_.isEqual(status, this.lastStatus)) {
//             this.lastStatus = status
//             break
//         }
//         await sleep(1000)
//     }
//     return this.lastStatus ?? {}
// }
// destroy() {
//     this.destroyed = true
// }
