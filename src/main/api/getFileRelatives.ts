import * as _ from "lodash"
import path from "path"
import { getFile } from "./getFile"
import { listFiles } from "./listFiles"
import { normalizePath } from "./normalizePath"
import { IFile } from "../../shared/IFile"

interface FileRelativesInfo {
    ParentFolder?: IFile
    NextSibling?: IFile
    PreviousSibling?: IFile
}
export async function getFileRelatives(p: string): Promise<FileRelativesInfo> {
    p = normalizePath(p)
    if (!p || p === "/") return {}
    const pi = path.posix.parse(path.posix.resolve(p))
    const name = pi.name + pi.ext
    // const pathInfo = new IoPath(p)
    const info: FileRelativesInfo = {}
    info.ParentFolder = (await getFile({ path: pi.dir })) ?? undefined
    if (!info.ParentFolder?.path) {
        return info
    }
    const files = await listFiles({ path: info.ParentFolder.path, files: false, folders: true })
    const parentFiles = _.orderBy(
        files.filter(t => t.isFolder),
        [t => t.name]
    )
    const index = parentFiles.findIndex(t => t.name === name)
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}
