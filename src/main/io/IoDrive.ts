import { IoFile } from "./IoFile"

export interface IoDrive extends IoFile {
    isReady: boolean
    /** in mac a string returns */
    availableFreeSpace: number | string
    capacity: string
}
