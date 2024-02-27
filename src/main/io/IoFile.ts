import * as fse from "fs-extra"

export interface IoFile {
    stats?: fse.Stats
    path: string
    isLink?: boolean
    isFile?: boolean
    isDir?: boolean
    Name: string
    LastWriteTime?: Date
    FullName?: string
    Length?: number
    Extension?: string
}
