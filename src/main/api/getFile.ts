import { Path, glob } from "glob"
import Path2 from "path"
import { IFile } from "../../shared/IFile"
import { normalizePath } from "./normalizePath"
import { globPathToFile } from "./toFile2"

export async function getFile(path: string): Promise<IFile | null> {
    const p = normalizePath(path)
    // if (!p) {
    //     const x: IFile = { isFolder: true, path: "", name: "Home" }
    //     return x
    // }
    const absPath = Path2.posix.resolve(p)
    const res = (await glob(glob.escape(absPath), { posix: true, withFileTypes: true, stat: true })) as Path[]
    const file = res[0]
    if (!file) return null

    return globPathToFile(res[0])
}
