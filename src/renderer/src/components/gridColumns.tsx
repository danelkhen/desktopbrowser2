import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined"
import { ReactElement } from "react"
import { Column } from "../../../shared/Column"
import { ColumnKey } from "./Grid"

export const descendingFirstColumns: ColumnKey[] = [Column.size, Column.modified]
// export const visibleGridColumns = [Column.type, Column.name, Column.modified, Column.size, Column.ext]

export const icons: { [key: string]: ReactElement } = {
    folder: <FolderOpenOutlinedIcon />,
    file: <InsertDriveFileOutlinedIcon />,
    link: <LinkOutlinedIcon />,
}

export function getFileTypeOrder(type: string): number {
    const order = ["folder", "link", "file"].reverse()
    return order.indexOf(type)
}
