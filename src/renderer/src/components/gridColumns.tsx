import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined"
import { ReactElement } from "react"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"

export const descendingFirstColumns = [Column.size, Column.modified] as string[]

export const icons: { [key: string]: ReactElement } = {
    folder: <FolderOpenOutlinedIcon />,
    file: <InsertDriveFileOutlinedIcon />,
    link: <LinkOutlinedIcon />,
}

export function getFileTypeOrder(type: string): number {
    const order = ["folder", "link", "file"].reverse()
    return order.indexOf(type)
}

export function FileIcon({ file }: { file: IFile }) {
    if (file.isFolder) return icons.folder
    if (file.type === "link") return icons.link
    return (file.type && icons[file.type]) ?? null
}

export function isMediaFile(name: string) {
    return isVideoFile(name) || isAudioFile(name)
}

export function isVideoFile(name: string) {
    return /\.(mp4|mkv|avi|webm|mov|wmv|flv|3gp|ogg|ogv)$/i.test(name)
}
export function isAudioFile(name: string) {
    return /\.(mp3|flac|wav|ogg|aac|wma)$/i.test(name)
}
