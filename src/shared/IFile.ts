export interface IFile {
    isFolder?: boolean
    isLink?: boolean
    isFile?: boolean
    name: string
    path: string
    modified?: string
    isHidden?: boolean
    size?: number
    ext?: string
}
