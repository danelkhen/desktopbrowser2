import { ReactElement } from "react"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import FileEmptyIcon from "../assets/linearicons/svg/file-empty.svg?react"
import LayersIcon from "../assets/linearicons/svg/layers.svg?react"
import LinkIcon from "../assets/linearicons/svg/link.svg?react"
import { formatFriendlyDate } from "../lib/formatFriendlyDate"
import { formatFriendlySize } from "../lib/formatFriendlySize"
import { dispatcher } from "../services/Dispatcher"
import { GridColumns } from "./Grid"
import { c } from "../services/c"

export const gridColumns: GridColumns<IFile> = {
    type: {
        getter: t => t.type,
        cell: file => (file.type && icons[file.type] && icons[file.type]) || null,
        header: () => "",
        sortGetter: x => (x.type && dispatcher.getFileTypeOrder(x.type)) ?? 0,
        width: "35px",
    },
    name: {
        getter: t => t.name,
        cell: file => (
            <span>
                <a className={c.name}>{file.name}</a>
            </span>
        ),
        // width: "100%",
    },
    size: {
        getter: t => t.size,
        cell: file => <span>{formatFriendlySize(file.size)}</span>,
        descendingFirst: true,
        width: "150px",
    },
    modified: {
        getter: t => t.modified,
        cell: file => <span>{formatFriendlyDate(file.modified ?? null)}</span>,
        descendingFirst: true,
        width: "150px",
    },
    ext: { getter: t => t.ext, cell: file => !file.isFolder && <span>{file.ext}</span>, width: "150px" },
    hasInnerSelection: {
        getter: t => !!t?.isFolder && !!dispatcher.getSavedSelectedFile(t.name),
        descendingFirst: true,
    },
}

export const visibleGridColumns = [Column.type, Column.name, Column.modified, Column.size, Column.ext]

export const icons: { [key: string]: ReactElement } = {
    folder: <LayersIcon />,
    file: <FileEmptyIcon />,
    link: <LinkIcon />,
}
