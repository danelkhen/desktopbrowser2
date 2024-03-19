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
            req.sort.map(t => t.name),
            req.sort.map(t => (t.desc ? "desc" : "asc"))
        )
    }
    if (req.hideWatched) {
        const keys = files.map(t => t.name)
        const res = await db.folderSelection.getMany(keys)
        const obj = Object.fromEntries(res.map((t, i) => [keys[i], t]))
        files = files.filter(t => !!obj[t.name])
    }
    if (req.folderSize && !req.hideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}
