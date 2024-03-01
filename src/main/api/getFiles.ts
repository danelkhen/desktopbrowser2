import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { applyPaging } from "./applyPaging"
import { applyRequest } from "./applyRequest"
import { listFiles } from "./listFiles"

export async function getFiles(req: IListFilesReq): Promise<IFile[]> {
    if (req.hideFiles && req.hideFolders) {
        return []
    }
    let files = await listFiles({
        path: req.path ?? "/",
        recursive: req.recursive,
        files: !req.hideFiles,
        folders: !req.hideFolders,
    })
    files = await applyRequest(files, req)
    files = applyPaging(files, req)
    return files
}
