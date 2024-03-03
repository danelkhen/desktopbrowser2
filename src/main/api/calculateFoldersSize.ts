import { IFile } from "../../shared/IFile"
import { DirSizeCache, io } from "../io/io"

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
                file.size = await io.getSize(file.path, cache)
            }
        } catch (e) {
            console.log("calculateFoldersSize error", e)
        }
        list.push(file)
    }
    return list
}
