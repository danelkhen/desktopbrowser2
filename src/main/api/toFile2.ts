import { Path } from "glob"
import { IFile } from "../../shared/IFile"
import path from "path"

export function toFile2(file: Path): IFile {
    const parsed = path.parse(file.name)
    const file2: IFile = {
        type: undefined,
        Name: file.name,
        IsFolder: !!file.isDirectory(),
        Modified: file.mtime?.toJSON(),
        Size: file.isFile() ? file.size : undefined,
        IsHidden: file.name?.startsWith("."),
        Extension: parsed.ext,
    }
    if (file.isDirectory()) {
        file2.type = "folder"
    } else if (file.isFile()) {
        file2.type = "file"
    } else if (file.isSymbolicLink()) {
        file2.type = "link"
    }
    try {
        file2.Path = path.join(file.path, file.name)
    } catch (e) {
        console.log("ToFile error", e, file)
    }
    return file2
}
