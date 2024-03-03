import { IFile } from "../../shared/IFile"
import { io } from "../io/io"

export async function getHomeFiles(): Promise<IFile[]> {
    const list = await io.getDrives()
    return list.map(t => {
        const f: IFile = {
            isFolder: true,
            name: t.Name,
            path: t.Name,
            size: t.isReady ? +(t.availableFreeSpace as string) : undefined,
        }
        return f
    })
}
