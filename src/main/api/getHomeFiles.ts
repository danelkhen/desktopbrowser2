import { IFile } from "../../shared/IFile"
import { getDrives } from "../lib/getDrives"

export async function getHomeFiles(): Promise<IFile[]> {
    const list = await getDrives()
    return list.map(t => {
        const f: IFile = {
            isFolder: true,
            name: t.name,
            path: t.name,
            size: t.isReady ? +(t.availableFreeSpace as string) : undefined,
        }
        return f
    })
}
