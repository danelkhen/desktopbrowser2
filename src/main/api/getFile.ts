import { IFile } from "../../shared/IFile"
import { IoFile } from "../io/IoFile"
import { IoPath } from "../io/IoPath"
import { toFile } from "./toFile"
import { normalizePath } from "./normalizePath"

export async function getFile({ path }: { path: string }): Promise<IFile | null> {
    const p = normalizePath(path)
    if (!p) {
        const x: IFile = { IsFolder: true, Path: "", Name: "Home" }
        return x
    }
    const absPath = new IoPath(p).ToAbsolute()
    if (await absPath.IsFile) {
        return toFile(await IoFile.get(absPath.Value))
    } else if ((await absPath.IsDirectory) || absPath.IsRoot) {
        return toFile(await IoFile.get(absPath.Value))
    }
    return null
}
