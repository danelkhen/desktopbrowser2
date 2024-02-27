import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { applyPaging } from "./applyPaging"
import { applyRequest } from "./applyRequest"
import { listFiles2 } from "./listFiles2"

export async function getFiles(req: IListFilesReq): Promise<IFile[]> {
    if (req.HideFiles && req.HideFolders) {
        return []
    }
    let files = await listFiles2({
        path: req.Path ?? "/",
        recursive: req.IsRecursive,
        files: !req.HideFiles,
        folders: !req.HideFolders,
    })
    files = await applyRequest(files, req)
    files = applyPaging(files, req)
    return files
}
