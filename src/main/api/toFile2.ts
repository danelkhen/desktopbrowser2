import { Path } from "glob"
import { IFile } from "../../shared/IFile"
import path from "path"
import { Stats } from "fs"

export function toFile2(file: Path): IFile {
    const file2: IFile = {
        type: getType(file),
        Name: file.name,
        IsFolder: !!file.isDirectory(),
        Modified: file.mtime?.toJSON(),
        Size: file.isFile() ? file.size : undefined,
        IsHidden: file.name?.startsWith("."),
        Extension: path.extname(file.name),
        Path: file.fullpath(),
    }
    return file2
}

export function toFile3(p: string, stat: Stats | null) {
    const parsed = path.parse(p)
    const file2: IFile = {
        type: getType(stat),
        Name: parsed.name,
        IsFolder: !!stat?.isDirectory(),
        Modified: stat?.mtime?.toJSON(),
        Size: stat?.isFile() ? stat.size : undefined,
        IsHidden: parsed.name.startsWith("."),
        Extension: path.extname(parsed.name),
        Path: p,
    }
    return file2
}
function getType(stat: Path | Stats | null) {
    if (stat?.isDirectory()) {
        return "folder"
    } else if (stat?.isFile()) {
        return "file"
    } else if (stat?.isSymbolicLink()) {
        return "link"
    }
}
