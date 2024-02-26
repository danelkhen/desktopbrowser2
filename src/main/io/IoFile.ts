import * as fse from "fs-extra"
import * as path from "path"

export interface IoFile {
    stats?: fse.Stats
    path: string
    isLink?: boolean
    isFile?: boolean
    isDir?: boolean
    Name: string
    LastWriteTime?: Date
    FullName?: string
    Length?: number
    Extension?: string
}

export const IoFile = {
    async getChildren(path2: string): Promise<IoFile[]> {
        const list = await fse.readdir(path2)
        const list2: IoFile[] = []
        for (const t of list) {
            list2.push(await IoFile.get(path.join(path2, t)))
        }
        return list2
    },

    async getDescendants(path2: string): Promise<IoFile[]> {
        const list = await IoFile.getChildren(path2)
        let i = 0
        while (i < list.length) {
            const file = list[i]
            if (file.isDir) {
                const list2 = await IoFile.getChildren(file.path)
                list.push(...list2)
            }
            i++
        }
        return list
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
    async Exists(s: string): Promise<boolean | undefined> {
        if (!(await fse.pathExists(s))) return
        const stat = await fse.stat(s)
        return stat.isFile()
    },
    async Delete(s: string): Promise<boolean> {
        await fse.unlink(s)
        return true
    },
}
