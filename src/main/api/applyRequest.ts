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
    if (req.sort?.length) {
        files = _.orderBy(
            files,
            req.sort.map(t => t.Name),
            req.sort.map(t => (t.Descending ? "desc" : "asc"))
        )
    }
    if (req.folderSize && !req.hideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
