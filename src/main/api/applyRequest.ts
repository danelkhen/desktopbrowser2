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
    if (req.sort?.length) {
        files = _.orderBy(
            files,
            req.sort.map(t => t.Name),
            req.sort.map(t => (t.Descending ? "desc" : "asc"))
        )
    }
    if (req.hideWatched) {
        const res = await db.files.getMany(files.map(t => t.name))
        const obj = Object.fromEntries(res.map(t => [t.key, t]))
        files = files.filter(t => !!obj[t.name])
    }
    if (req.folderSize && !req.hideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
