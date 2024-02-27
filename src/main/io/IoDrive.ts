import { IoFile } from "./IoFile"

export interface IoDrive extends IoFile {
    IsReady: boolean
    /** in mac a string returns */
    AvailableFreeSpace: number | string
    Capacity: string
}
