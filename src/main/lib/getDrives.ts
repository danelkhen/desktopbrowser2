import { getDiskInfo } from "node-disk-info"
import Drive from "node-disk-info/dist/classes/drive"

export async function getDrives(): Promise<DriveInfo[]> {
    const list = await getDiskInfo()
    const drives = list.map(t => toDriveInfo(t))
    return drives
}
export function toDriveInfo(x: Drive) {
    const di: DriveInfo = {
        path: x.mounted + "\\",
        name: x.mounted,
        isReady: true,
        availableFreeSpace: x.available,
        capacity: x.capacity,
    }
    return di
}
export interface DriveInfo {
    isReady: boolean
    /** in mac a string returns */
    availableFreeSpace: number | string
    capacity: string
    path: string
    name: string
}
