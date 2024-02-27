import { IFile } from "../../shared/IFile"
import { IoDrive } from "../io/IoDrive"

export async function getHomeFiles(): Promise<IFile[]> {
    const list = await IoDrive.getDrives()
    return list.map(t => /*new File*/ ({
        IsFolder: true,
        Name: t.Name,
        Path: t.Name,
        Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : undefined,
    }))
}
