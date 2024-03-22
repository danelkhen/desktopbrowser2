import * as _ from "lodash"
import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { db } from "../services"
import { calculateFoldersSize } from "./calculateFoldersSize"

export async function applyRequest(files: IFile[], req: IListFilesReq): Promise<IFile[]> {
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
    if (req.hideWatched) {
        const keys = files.map(t => t.name)
        const obj = await db.getFolderSelections(keys)
        files = files.filter(t => !!obj[t.name])
    }
    if (req.folderSize && !req.hideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
