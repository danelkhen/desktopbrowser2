import { IFile } from "../../shared/IFile"
import { io } from "../io/io"

export async function getHomeFiles(): Promise<IFile[]> {
    const list = await io.getDrives()
    return list.map(t => /*new File*/ ({
        IsFolder: true,
        Name: t.Name,
        Path: t.Name,
        Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : undefined,
    }))
}
