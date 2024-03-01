import * as _ from "lodash"
import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { calculateFoldersSize } from "./calculateFoldersSize"

export async function applyRequest(files: IFile[], req: IListFilesReq): Promise<IFile[]> {
    if (!req.hidden) {
        files = files.filter(t => !t.IsHidden)
    }
    if (req.hideFolders) {
        files = files.filter(t => !t.IsFolder)
    }
    if (req.hideFiles) {
        files = files.filter(t => t.IsFolder)
    }
    if (req.Sort != null && req.Sort.Columns != null) {
        files = _.orderBy(
            files,
            req.Sort.Columns.map(t => t.Name),
            req.Sort.Columns.map(t => (t.Descending ? "desc" : "asc"))
        )
    }
    if (req.folderSize && !req.hideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
