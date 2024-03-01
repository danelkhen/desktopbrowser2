import { IFile } from "./IFile"

export interface IListFilesRes {
    readonly file?: IFile
    readonly files?: IFile[]
    readonly parent?: IFile
    readonly next?: IFile
    readonly prev?: IFile
}
