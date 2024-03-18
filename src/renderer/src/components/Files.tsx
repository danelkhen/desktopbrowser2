import { css, cx } from "@emotion/css"
import React, { useCallback } from "react"
import { IFile } from "../../../shared/IFile"
import { calcItemsOnScreen } from "../hooks/calcItemsOnScreen"
import { SortConfig } from "../hooks/useSorting"
import { Selection } from "../lib/Selection"
import { dispatcher } from "../services/Dispatcher"
import { c } from "../services/c"
import { fileRow } from "../services/fileRow"
import { Grid } from "./Grid"
import { gridColumns, visibleGridColumns } from "./gridColumns"

export function Files({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    files,
    sorting,
    noHead,
    noBody,
}: {
    setSelectedFiles: (v: Set<IFile>) => void
    selectedFiles: Set<IFile>
    allFiles: IFile[]
    files: IFile[]
    sorting: SortConfig
    noHead?: boolean
    noBody?: boolean
}) {
    const onItemMouseDown = useCallback(
        (e: React.MouseEvent, file: IFile) => {
            const itemsOnScreen = calcItemsOnScreen(document.querySelector(`.${fileRow}`))
            const selection = new Selection({ all: allFiles, selected: selectedFiles, itemsOnScreen })
            const newSelection = selection.click(file, e)
            setSelectedFiles(newSelection.selected)
        },
        [allFiles, selectedFiles, setSelectedFiles]
    )

    const onItemClick = useCallback((e: React.MouseEvent, file: IFile) => {
        // const selection = new Selection(allFiles, selectedFiles)
        const target = e.target as HTMLElement
        if (!target.matches(`a.${c.name}`)) {
            return
        }
        e.preventDefault()
        void dispatcher.Open(file)
    }, [])

    const onItemDoubleClick = useCallback((e: React.MouseEvent, file: IFile) => {
        if (file === null) {
            return
        }
        e.preventDefault()
        void dispatcher.Open(file)
    }, [])

    return (
        <Grid<IFile>
            className={GrdFiles}
            items={files}
            getHeaderClass={col =>
                cx(
                    col,
                    dispatcher.isSortedBy(sorting, col) && c.sorted,
                    dispatcher.isSortedBy(sorting, col, false) && c.asc,
                    dispatcher.isSortedBy(sorting, col, true) && c.desc
                )
            }
            orderBy={dispatcher.orderBy}
            onItemMouseDown={onItemMouseDown}
            onItemClick={onItemClick}
            onItemDoubleClick={onItemDoubleClick}
            getRowClass={file => {
                const s = cx(
                    fileRow,
                    file.isFolder && c.isFolder,
                    dispatcher.hasInnerSelection(file) && c.hasInnerSelection,
                    selectedFiles.has(file) && c.selected
                )
                return s
            }}
            columns={gridColumns}
            visibleColumns={visibleGridColumns}
            noHead={noHead}
            noBody={noBody}
        />
    )
}

const GrdFiles = css`
    label: GrdFiles;
    user-select: none;

    > table {
        width: 100%;
        > tbody {
            > tr {
                transition: all 0.3s ease;
                -webkit-font-smoothing: antialiased;
                border: 1px solid #0c0c0c;
                color: #999;
                > td {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    box-sizing: border-box;
                    padding: 10px 0px;
                }
            }
        }
        > thead,
        > tbody {
            > tr {
                > .${c.type} {
                    /* text-overflow: clip; */
                    padding: 10px 5px;
                }
            }
        }
        > thead {
            > tr {
                background-color: #060606;
                border-bottom: 1px solid #333;
                text-align: left;
                > th {
                    padding: 10px;
                    font-size: 10px;
                    text-transform: uppercase;
                    -webkit-font-smoothing: antialiased;
                    letter-spacing: 1px;
                    color: #999;
                    font-weight: normal;
                    text-align: left;
                }
            }
        }
    }
`
