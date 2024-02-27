import { IFile } from "../../shared/IFile"
import { IoFile } from "../io/IoFile"

export function toFile(file: IoFile): IFile {
    const file2: IFile = {
        type: undefined,
        Name: file.Name,
        IsFolder: !!file.isDir,
        Modified: file.LastWriteTime?.toJSON(),
        Size: file.isFile ? file.Length : undefined,
        IsHidden: file.Name?.startsWith("."),
        Extension: file?.Extension,
    }
    if (file.isDir) {
        file2.type = "folder"
    } else if (file.isFile) {
        file2.type = "file"
    } else if (file.isLink) {
        file2.type = "link"
    }
    try {
        file2.Path = file.FullName
    } catch (e) {
        console.log("ToFile error", e, file)
    }
    return file2
}
