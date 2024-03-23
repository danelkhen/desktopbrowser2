import { Path } from "glob"
import path from "path"
import { IFile } from "../../shared/IFile"

export function globPathToFile(file: Path): IFile {
    const file2: IFile = {
        // type: getType(file),
        name: file.name,
        isFolder: file.isDirectory() ? true : undefined,
        isLink: file.isSymbolicLink() ? true : undefined,
        isFile: file.isFile() ? true : undefined,
        modified: file.mtime?.toJSON(),
        size: file.isFile() ? file.size : undefined,
        isHidden: file.name?.startsWith("."),
        ext: path.posix.extname(file.name),
        path: normalizeGlobFullpathPosix(file.fullpathPosix()),
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
// function getType(stat: Path | Stats | null) {
//     if (stat?.isDirectory()) {
//         return "folder"
//     } else if (stat?.isFile()) {
//         return "file"
//     } else if (stat?.isSymbolicLink()) {
//         return "link"
//     }
// }

function normalizeGlobFullpathPosix(s: string) {
    if (s.startsWith("//?")) return s.replace("//?", "")
    return s
}
