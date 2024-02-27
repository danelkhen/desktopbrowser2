import * as fse from "fs-extra"
import { getDiskInfo } from "node-disk-info"
import Drive from "node-disk-info/dist/classes/drive"
import * as path from "path"
import { rimraf } from "rimraf"
import { IoDrive } from "./IoDrive"
import { IoFile } from "./IoFile"
import { glob } from "glob"

export type DirSizeCache = { [path: string]: number }

export const io = {
    async dirExists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        const stat = await fse.stat(s)
        return stat.isDirectory()
    },
    async getSize(path: string, cache: DirSizeCache = {}): Promise<number> {
        if (cache[path] !== undefined) {
            return cache[path]
        }
        let size = 0
        try {
            const list = await glob(`${path}/*`, { stat: true, withFileTypes: true })
            for (const item of list) {
                if (item.isFile() && item.size !== undefined) {
                    size += item.size
                } else if (item.isDirectory() && item.fullpath()) {
                    const dirSize = await io.getSize(item.fullpath(), cache)
                    size += dirSize
                }
            }
        } catch (e) {
            console.log("IoDir.getSize() error", path, e)
        }
        cache[path] = size
        return size
    },
    async del(path: string) {
        return await rimraf(path, { glob: false })
    },
    async getDrives(): Promise<IoDrive[]> {
        const list = await getDiskInfo()
        const drives = list.map(t => toDriveInfo(t))
        return drives
    },

    async get(path2: string): Promise<IoFile> {
        const FullName = path.resolve(path2)
        const Name = path.basename(path2)
        const Extension = path.extname(path2)
        const x: IoFile = {
            path: path2,
            FullName,
            Name,
            Extension,
        }
        try {
            x.stats = await fse.lstat(path2)
            x.Length = x.stats.size
            x.isFile = x.stats.isFile()
            x.isDir = x.stats.isDirectory()
            x.LastWriteTime = x.stats.mtime
            x.isLink = x.stats.isSymbolicLink()
        } catch (e) {
            console.log("IoFile.get() error", e, path2)
        }
        if (x.Name == null || x.Name == "") {
            x.Name = path2
        }
        return x
    },
    async fileExists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        const stat = await fse.stat(s)
        return stat.isFile()
    },
    async delete(s: string): Promise<boolean> {
        await fse.unlink(s)
        return true
    },
}

export function toDriveInfo(x: Drive) {
    const di: IoDrive = {
        path: x.mounted + "\\",
        Name: x.mounted,
        IsReady: true,
        AvailableFreeSpace: x.available,
        Capacity: x.capacity,
    }
    return di
}
