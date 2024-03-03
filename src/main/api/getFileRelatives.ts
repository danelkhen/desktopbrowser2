import * as _ from "lodash"
import path from "path"
import { FileRelativesInfo } from "../../shared/FileRelativesInfo"
import { getFile } from "./getFile"
import { listFiles } from "./listFiles"
import { normalizePath } from "./normalizePath"

export async function getFileRelatives(p: string): Promise<FileRelativesInfo> {
    p = normalizePath(p)
    if (!p || p === "/") return {}
    const pathInfo = path.posix.parse(path.posix.resolve(p))
    // const pathInfo = new IoPath(p)
    const info: FileRelativesInfo = {}
    info.ParentFolder = (await getFile({ path: pathInfo.dir })) ?? undefined
    if (!info.ParentFolder?.path) {
        return info
    }
    const files = await listFiles({ path: info.ParentFolder.path, files: false, folders: true })
    const parentFiles = _.orderBy(
        files.filter(t => t.isFolder),
        [t => t.name]
    )
    const index = parentFiles.findIndex(t => t.name === pathInfo.name)
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}
