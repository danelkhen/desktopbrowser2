export interface IFile {
    IsFolder: boolean
    Name: string
    Path?: string
    Modified?: string
    IsHidden?: boolean
    Size?: number
    Extension?: string
    type?: "file" | "folder" | "link" | string
}
