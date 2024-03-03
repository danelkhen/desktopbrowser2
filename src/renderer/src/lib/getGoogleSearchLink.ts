import { IFile } from "../../../shared/IFile"
import { getFilenameForSearch } from "./getFilenameForSearch"

export function getGoogleSearchLink(file: IFile): string {
    const s = getFilenameForSearch(file.name)
    return "https://www.google.com/search?q=" + encodeURIComponent(s)
}
