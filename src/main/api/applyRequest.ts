import * as _ from "lodash"
import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { calculateFoldersSize } from "./calculateFoldersSize"

export async function applyRequest(files: IFile[], req: IListFilesReq): Promise<IFile[]> {
    if (!req.ShowHiddenFiles) {
        files = files.filter(t => !t.IsHidden)
    }
    if (req.HideFolders) {
        files = files.filter(t => !t.IsFolder)
    }
    if (req.HideFiles) {
        files = files.filter(t => t.IsFolder)
    }
    if (req.Sort != null && req.Sort.Columns != null) {
        files = _.orderBy(
            files,
            req.Sort.Columns.map(t => t.Name),
            req.Sort.Columns.map(t => (t.Descending ? "desc" : "asc"))
        )
    }
    if (req.FolderSize && !req.HideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
