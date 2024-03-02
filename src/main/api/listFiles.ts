import { glob, Path } from "glob"
import path3 from "path"
import { IFile } from "../../shared/IFile"
import { isWindows } from "../lib/isWindows"
import { getHomeFiles } from "./getHomeFiles"
import { normalizePath } from "./normalizePath"
import { globPathToFile } from "./toFile2"

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
    const path2 = path3.posix.resolve(path)
    const res = (await glob(`${path2}${g}${foldersOnlySuffix}`, {
        stat: true,
        withFileTypes: true,
        nodir,
        posix: true,
    })) as Path[]
    const files2 = res.map(t => globPathToFile(t))
    return files2
}
