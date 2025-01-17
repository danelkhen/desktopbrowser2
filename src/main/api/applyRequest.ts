import * as _ from "lodash"
import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { calculateFoldersSize } from "./calculateFoldersSize"

export async function applyFiltersAndSorting(files: IFile[], req: IListFilesReq): Promise<IFile[]> {
    if (!req.hidden) {
        files = files.filter(t => !t.isHidden)
    }
    if (req.hideFolders) {
        files = files.filter(t => !t.isFolder)
    }
    if (req.hideFiles) {
        files = files.filter(t => t.isFolder)
    }
    if (Object.keys(req.sort ?? {}).length) {
        files = _.orderBy(files, Object.keys(req.sort!), Object.values(req.sort!))
    }
    return files
}

export async function applySelectionFiltersAndFolderSizes(
    files: IFile[],
    req: IListFilesReq,
    selections: Record<string, string | undefined>
): Promise<IFile[]> {
    if (req.hideWatched) {
        files = files.filter(t => !selections[t.name])
    }
    if (req.folderSize && !req.hideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
