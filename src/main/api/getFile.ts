import { glob } from "glob"
import Path from "path"
import { IFile } from "../../shared/IFile"
import { normalizePath } from "./normalizePath"
import { toFile2 } from "./toFile2"

export async function getFile({ path }: { path: string }): Promise<IFile | null> {
    const p = normalizePath(path)
    if (!p) {
        const x: IFile = { IsFolder: true, Path: "", Name: "Home" }
        return x
    }
    const absPath = Path.posix.resolve(p)
    const res = await glob(absPath, { posix: true, withFileTypes: true, stat: true })

    return toFile2(res[0])
}
