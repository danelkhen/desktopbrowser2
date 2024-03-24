import { glob } from "glob"
import { IFile } from "../../shared/IFile"

let dirSizeCacheTime: number | undefined
let dirSizeCache: DirSizeCache | undefined
function getDirSizeCache() {
    const tenMinutes = 10 * 60 * 1000
    if (dirSizeCache && dirSizeCacheTime && Date.now() - dirSizeCacheTime < tenMinutes) {
        return dirSizeCache
    }
    dirSizeCache = {}
    dirSizeCacheTime = Date.now()
    return dirSizeCache
}
export async function calculateFoldersSize(folders: IFile[]): Promise<IFile[]> {
    const cache = getDirSizeCache()
    const list: IFile[] = []
    for (const file of folders) {
        try {
            //console.log("CalculateFoldersSize", file);
            if (file.isFolder && file.path) {
                file.size = await getSize(file.path, cache)
            }
        } catch (e) {
            console.log("calculateFoldersSize error", e)
        }
        list.push(file)
    }
    return list
}

export type DirSizeCache = { [path: string]: number }

async function getSize(path: string, cache: DirSizeCache = {}): Promise<number> {
    if (cache[path] !== undefined) {
        return cache[path]!
    }
    let size = 0
    try {
        const list = await glob(`${glob.escape(path)}/*`, {
            stat: true,
            withFileTypes: true,
            posix: true,
        })
        for (const item of list) {
            if (typeof item === "string") continue
            if (item.isFile() && item.size !== undefined) {
                size += item.size
            } else if (item.isDirectory() && item.fullpathPosix()) {
                const dirSize = await getSize(item.fullpathPosix(), cache)
                size += dirSize
            }
        }
    } catch (e) {
        console.log("IoDir.getSize() error", path, e)
    }
    cache[path] = size
    return size
}
