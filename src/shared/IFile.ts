export interface IFile {
    isFolder: boolean
    name: string
    path: string
    modified?: string
    isHidden?: boolean
    size?: number
    ext?: string
    type?: "file" | "folder" | "link" | string
}
