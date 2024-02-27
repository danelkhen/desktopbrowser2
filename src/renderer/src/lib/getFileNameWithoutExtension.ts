import { IFile } from "../../../shared/IFile"

export function getFileNameWithoutExtension(file: IFile): string {
    if (file.IsFolder) return file.Name
    let s = file.Name
    const index = s.lastIndexOf(".")
    if (index < 0) return s
    s = s.substr(0, index)
    return s
}
