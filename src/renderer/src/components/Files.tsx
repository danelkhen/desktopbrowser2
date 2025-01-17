import { css, cx } from "@emotion/css"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import React, { useCallback, useMemo } from "react"
import { ISorting } from "src/shared/ISorting"
import { IFile } from "../../../shared/IFile"
import { calcItemsOnScreen } from "../hooks/calcItemsOnScreen"
import { pageSize } from "../hooks/usePaging"
import { Selection } from "../lib/Selection"
import { formatFriendlyDate } from "../lib/formatFriendlyDate"
import { formatFriendlySize } from "../lib/formatFriendlySize"
import { c } from "../services/c"
import { FileIcon } from "./FileIcon"
// import { progressMixin, progressStyle } from "./progress"
import { useVlcStatus } from "./useVlcStatus"

export function Files({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    files,
    noHead,
    noBody,
    open,
    orderBy,
    sorting,
    hasInnerSelection,
}: {
    setSelectedFiles: (v: IFile[]) => void
    selectedFiles: IFile[]
    allFiles: IFile[]
    files: IFile[]
    noHead?: boolean
    noBody?: boolean
    open: (file: IFile) => Promise<void>
    orderBy: (column: string) => void
    sorting: ISorting
    hasInnerSelection: (file: IFile) => boolean
}) {
    const selectedFiles2 = useMemo(() => new Set(selectedFiles), [selectedFiles])
    const onFileMouseDown = useCallback(
        (e: React.MouseEvent, file: IFile) => {
            const itemsOnScreen = calcItemsOnScreen(document.querySelector(`.${c.fileRow}`))
            const selection = new Selection({ all: allFiles, selected: selectedFiles2, itemsOnScreen })
            const newSelection = selection.click(file, e)
            if (newSelection === selection) return
            setSelectedFiles(Array.from(newSelection.selected))
        },
        [allFiles, selectedFiles2, setSelectedFiles]
    )

    const onFileClick = useCallback(
        (e: React.MouseEvent, file: IFile) => {
            // const selection = new Selection(allFiles, selectedFiles)
            const target = e.target as HTMLElement
            if (!target.matches(`a.${c.name}`)) {
                return
            }
            e.preventDefault()
            void open(file)
        },
        [open]
    )

    const onFileDoubleClick = useCallback(
        (e: React.MouseEvent, file: IFile) => {
            if (!file) {
                return
            }
            e.preventDefault()
            void open(file)
        },
        [open]
    )
    const vlcStatus = useVlcStatus()

    // function getFileProgressStyle(file: IFile) {
    //     return "" //progressStyle({ position: vlcStatus.path === file.path ? vlcStatus.position : undefined, start: "36px" })
    // }
    const gridColumns = {
        type: {
            className: c.type,
            cell: (file: IFile) => <FileIcon file={file} vlcStatus={vlcStatus} />,
            header: "",
            width: "40px",
        },
        name: {
            className: c.name,
            width: undefined,
            header: "Name",
            cell: (file: IFile) => (
                <span>
                    <a className={c.name} id={file.name}>
                        {file.name}
                    </a>
                </span>
            ),
        },
        modified: {
            className: undefined,
            header: "Modified",
            cell: (file: IFile) => <span>{formatFriendlyDate(file.modified ?? null)}</span>,
            width: "150px",
        },
        size: {
            className: undefined,
            header: "Size",
            cell: (file: IFile) => <span>{formatFriendlySize(file.size)}</span>,
            width: "150px",
        },
        ext: {
            className: undefined,
            header: "Ext",
            cell: (file: IFile) => !file.isFolder && <span>{file.ext}</span>,
            width: "150px",
        },
    }
    function isFirstItemInPage(i: number) {
        const pageIndex = Math.floor(i / pageSize)
        return i === pageSize * pageIndex
    }
    function isLastItemInPage(i: number) {
        const pageIndex = Math.floor(i / pageSize)
        return i === pageSize * pageIndex + pageSize - 1
    }

    return (
        <div className={`select-none ${style}`}>
            <table className="table-fixed w-full border-collapse border-spacing-0">
                <colgroup>
                    {Object.entries(gridColumns).map(([key, col]) => (
                        <col key={key} className={col.className} style={{ width: col.width }}></col>
                    ))}
                </colgroup>
                {!noHead && (
                    <thead>
                        <tr className="border-b border-solid border-neutral-700 bg-neutral-950">
                            {Object.entries(gridColumns).map(([key, col]) => {
                                const sortIndex = Object.keys(sorting).indexOf(key)
                                return (
                                    <th
                                        key={key}
                                        className="whitespace-nowrap align-middle box-border p-2 text-xs uppercase antialiased tracking-wide text-neutral-400 font-normal text-left cursor-pointer hover:bg-neutral-900"
                                        onClick={() => orderBy(key)}
                                    >
                                        {col.header}
                                        {sorting?.[key] === "asc" ? (
                                            <ArrowDropUpIcon
                                                viewBox="6 6 12 12"
                                                className={`ml-1 !text-base ${sortIndex === 0 ? "" : "!opacity-25"}`}
                                            />
                                        ) : sorting?.[key] === "desc" ? (
                                            <ArrowDropDownIcon
                                                viewBox="6 6 12 12"
                                                className={`ml-1 !text-base ${sortIndex === 0 ? "" : "!opacity-25"}`}
                                            />
                                        ) : null}
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                )}
                {!noBody && (
                    <tbody>
                        {files.map((file, i) => (
                            <tr
                                key={i}
                                className={cx(
                                    c.fileRow,
                                    file.isFolder && c.isFolder,
                                    hasInnerSelection(file) && c.hasInnerSelection,
                                    selectedFiles2.has(file) && c.selected,
                                    file.path === vlcStatus.path && c.opened,
                                    file.path === vlcStatus.path && vlcStatus.playing && c.playing,
                                    file.path === vlcStatus.path && vlcStatus.paused && c.paused,
                                    file.path === vlcStatus.path && vlcStatus.stopped && c.stopped,
                                    c.progress,
                                    `pageIndex-${Math.floor(i / pageSize)}`,
                                    isFirstItemInPage(i) && c.firstItemInPage,
                                    isLastItemInPage(i) && c.lastItemInPage
                                )}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                // style={{ ...getFileProgressStyle(file) }}
                                onMouseDown={e => onFileMouseDown(e, file)}
                                onClick={e => onFileClick(e, file)}
                                onDoubleClick={e => onFileDoubleClick(e, file)}
                            >
                                {Object.entries(gridColumns).map(([key, col]) => (
                                    <td key={key} className={cx(col.className)}>
                                        {col.cell(file)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    )
}

// const tableStyle = "table-fixed w-full border-collapse border-spacing-0"
// const theadTrStyle = "border-b-1 border-solid border-gray-300 bg-gray-100"
const style = css`
    label: Files;

    > table {
        > tbody {
            > tr {
                scroll-margin-top: 134px;
                transition: all 0.3s ease;
                -webkit-font-smoothing: antialiased;
                border: 1px solid #0c0c0c;
                transition: all 0.3s ease;
                color: #999;
                --bg: transparent;
                background: var(--bg);
                &:hover {
                    --bg: #000;
                    color: ${c.selection};
                    td .${c.name} {
                        text-decoration: none;
                        cursor: pointer;
                    }
                }
                &.${c.selected} {
                    color: #fff;
                    --bg: ${c.selection};
                    transition: all 0.3s ease;
                    &:hover {
                        --bg: ${c.selectionLight};
                    }
                }
                &.${c.opened} {
                    color: #fff;
                    /* {progressMixin} */
                }

                &.${c.isFolder}.${c.hasInnerSelection}.${c.selected} {
                    color: rgba(238, 238, 238, 0.7);
                }
                &.${c.hasInnerSelection} {
                    color: rgba(238, 238, 238, 0.3);
                }

                > td {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    box-sizing: border-box;
                    padding: 10px 0px;
                    &.${c.type} {
                        text-align: center;
                        /* padding: 0 5px; */
                        svg {
                            vertical-align: middle;
                            font-size: 1.5em;
                            &.${c.small} {
                                font-size: 1.25em;
                            }
                        }
                    }
                }
            }
        }
    }
`
