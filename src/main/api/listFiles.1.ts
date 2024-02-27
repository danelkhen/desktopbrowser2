import { IFile } from "../../shared/IFile"
import { io } from "../io/io"
import { isWindows } from "../lib/isWindows"
import { ListFilesOptions } from "./ListFilesOptions"
import { normalizePath } from "./normalizePath"
import { getHomeFiles } from "./getHomeFiles"
import { toFile } from "./toFile"

export async function listFiles({ path, recursive, files, folders }: ListFilesOptions): Promise<IFile[]> {
    console.log(path)
    path = normalizePath(path)
    //: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean
    let isFiltered = false
    let files2: IFile[]
    if (path === "/" && isWindows()) {
        files2 = await getHomeFiles()
    } else if (!files && !folders) {
        files2 = []
    }

    //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
    //if (searchPattern.IsNullOrEmpty())
    //    searchPattern = "*";
    else if (recursive) {
        const dir = await io.get(path)
        files2 = (await io.getDescendants(dir.path)).map(t => toFile(t))
    } else {
        const dir = await io.get(path)
        const children = await io.getChildren(dir.path)
        if (files && !folders) {
            files2 = children.filter(t => t.isFile).map(t => toFile(t))
        } else if (folders && !files) {
            files2 = children.filter(t => t.isDir).map(t => toFile(t))
        } else if (folders && files) {
            files2 = children.map(t => toFile(t))
        } else {
            throw new Error()
        }
        isFiltered = true
    }
    if (!isFiltered) {
        if (!files) {
            files2 = files2.filter(t => t.IsFolder)
        } else if (!folders) {
            files2 = files2.filter(t => !t.IsFolder)
        }
    }
    return files2
}
