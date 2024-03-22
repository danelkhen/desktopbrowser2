import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { listFiles } from "./listFiles"

export async function getFiles(req: IListFilesReq): Promise<IFile[]> {
    if (req.hideFiles && req.hideFolders) {
        return []
    }
    const files = await listFiles({
        path: req.path ?? "/",
        recursive: req.recursive,
        files: !req.hideFiles,
        folders: !req.hideFolders,
    })
    return files
}
