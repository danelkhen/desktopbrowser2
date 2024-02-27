import { glob } from "glob"
import Path from "path"
import { IFile } from "../../shared/IFile"
import { isWindows } from "../lib/isWindows"
import { getHomeFiles } from "./getHomeFiles"
import { normalizePath } from "./normalizePath"
import { toFile2 } from "./toFile2"

export async function listFiles({
    path,
    recursive,
    files,
    folders,
}: {
    path: string
    recursive?: boolean
    files?: boolean
    folders?: boolean
}): Promise<IFile[]> {
    console.log(path)
    path = normalizePath(path)
    const nodir = !folders
    const foldersOnlySuffix = folders && !files ? "/" : ""
    const g = recursive ? "/**/*" : "/*"
    if (path === "/" && isWindows()) {
        return await getHomeFiles()
    } else if (!files && !folders) {
        return []
    }
    const path2 = Path.resolve(path)
    const res = await glob(`${path2}${g}${foldersOnlySuffix}`, { stat: true, withFileTypes: true, nodir })
    const files2 = res.map(t => toFile2(t))
    return files2
}
