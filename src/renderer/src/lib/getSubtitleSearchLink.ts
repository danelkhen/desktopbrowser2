import { IFile } from "../../../shared/IFile"
import { getFilenameForSearch } from "./getFilenameForSearch"

export function getSubtitleSearchLink(file: IFile): string {
    const s = getFilenameForSearch(file.name)
    return `https://www.subscene.com/subtitles/searchbytitle?query=${encodeURIComponent(s)}`
}
