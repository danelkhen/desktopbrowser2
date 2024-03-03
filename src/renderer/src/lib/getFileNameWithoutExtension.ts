import { IFile } from "../../../shared/IFile"

export function getFileNameWithoutExtension(file: IFile): string {
    if (file.isFolder) return file.name
    let s = file.name
    const index = s.lastIndexOf(".")
    if (index < 0) return s
    s = s.substr(0, index)
    return s
}
