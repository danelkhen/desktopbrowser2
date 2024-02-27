import { FileRelativesInfo } from "./FileRelativesInfo"
import { IFile } from "./IFile"

export interface IListFilesRes {
    readonly File?: IFile
    readonly Files?: IFile[]
    readonly Relatives: FileRelativesInfo
}
