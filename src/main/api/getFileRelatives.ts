import * as _ from "lodash"
import { FileRelativesInfo } from "../../shared/FileRelativesInfo"
import { IoPath } from "../io/IoPath"
import { equalsIgnoreCase } from "../lib/equalsIgnoreCase"
import { normalizePath } from "./normalizePath"
import { getFile } from "./getFile"
import { listFiles } from "./listFiles"

export async function getFileRelatives(path: string): Promise<FileRelativesInfo> {
    path = normalizePath(path)
    if (!path || path === "/") return {}
    const pathInfo = new IoPath(path)
    const info: FileRelativesInfo = {}
    info.ParentFolder = (await getFile({ path: pathInfo.ParentPath.Value })) ?? undefined
    if (!info.ParentFolder?.path) {
        return info
    }
    const files = await listFiles({ path: info.ParentFolder.path, files: false, folders: true })
    const parentFiles = _.orderBy(
        files.filter(t => t.isFolder),
        [t => t.name]
    )
    const index = parentFiles.findIndex(t => equalsIgnoreCase(t.name, pathInfo.Name))
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}
