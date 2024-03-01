import { IFile } from "./IFile"

export interface IListFilesRes {
    readonly File?: IFile
    readonly Files?: IFile[]
    // readonly Relatives: FileRelativesInfo
    readonly ParentFolder?: IFile
    readonly NextSibling?: IFile
    readonly PreviousSibling?: IFile
}
