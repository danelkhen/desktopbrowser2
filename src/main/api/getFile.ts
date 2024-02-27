import fs from "fs/promises"
import Path from "path"
import { IFile } from "../../shared/IFile"
import { normalizePath } from "./normalizePath"
import { toFile3 } from "./toFile2"

export async function getFile({ path }: { path: string }): Promise<IFile | null> {
    const p = normalizePath(path)
    if (!p) {
        const x: IFile = { IsFolder: true, Path: "", Name: "Home" }
        return x
    }
    const absPath = Path.resolve(p)
    const stat = await fs.lstat(absPath).catch(() => null)

    return toFile3(absPath, stat)
}
