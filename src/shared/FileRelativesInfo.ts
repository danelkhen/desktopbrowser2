import { IFile } from "./IFile"

export interface FileRelativesInfo {
    ParentFolder?: IFile
    NextSibling?: IFile
    PreviousSibling?: IFile
}
