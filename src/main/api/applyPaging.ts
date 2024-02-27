import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"

export function applyPaging(files: IFile[], req: IListFilesReq): IFile[] {
    if (req.skip != null) files = files.slice(req.skip)
    if (req.take != null) files = files.slice(0, req.take + 1)
    return files
}
