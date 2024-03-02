import { Path } from "glob"
import { IFile } from "../../shared/IFile"
import path from "path"
import { Stats } from "fs"

export function globPathToFile(file: Path): IFile {
    const file2: IFile = {
        type: getType(file),
        Name: file.name,
        IsFolder: !!file.isDirectory(),
        Modified: file.mtime?.toJSON(),
        Size: file.isFile() ? file.size : undefined,
        IsHidden: file.name?.startsWith("."),
        Extension: path.posix.extname(file.name),
        Path: normalizeGlobFullpathPosix(file.fullpathPosix()),
    }
    return file2
}

// if (typeof file === "string") {
//     const file2: IFile = {
//         Name: path.posix.basename(file),
//         IsFolder: true, // !!file.isDirectory(),
//         // Modified: file.mtime?.toJSON(),
//         // Size: file.isFile() ? file.size : undefined,
//         // IsHidden: file.name?.startsWith("."),
//         // Extension: path.extname(file.name),
//         Path: file,
//     }
//     return file2
// }
// export function toFile3(p: string, stat: Stats | null) {
//     const parsed = path.posix.parse(p)
//     const file2: IFile = {
//         type: getType(stat),
//         Name: parsed.name,
//         IsFolder: !!stat?.isDirectory(),
//         Modified: stat?.mtime?.toJSON(),
//         Size: stat?.isFile() ? stat.size : undefined,
//         IsHidden: parsed.name.startsWith("."),
//         Extension: path.posix.extname(parsed.name),
//         Path: p,
//     }
//     return file2
// }
function getType(stat: Path | Stats | null) {
    if (stat?.isDirectory()) {
        return "folder"
    } else if (stat?.isFile()) {
        return "file"
    } else if (stat?.isSymbolicLink()) {
        return "link"
    }
}

function normalizeGlobFullpathPosix(s: string) {
    if (s.startsWith("//?")) return s.replace("//?", "")
    return s
}
