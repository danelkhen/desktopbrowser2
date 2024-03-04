import { css, cx } from "@emotion/css"
import React, { useCallback } from "react"
import { IFile } from "../../../shared/IFile"
import { SortConfig } from "../hooks/useSorting"
import { dispatcher } from "../services/Dispatcher"
import { Selection } from "../lib/Selection"
import { c } from "../services/c"
import { Grid, GridColumns } from "./Grid"
import { visibleGridColumns } from "./gridColumns"
import { calcItemsOnScreen } from "../hooks/calcItemsOnScreen"

export function Files({
    selectedFiles,
    allFiles,
    setSelectedFiles,
    columns,
    files,
    sorting,
}: {
    setSelectedFiles: (v: IFile[]) => void
    selectedFiles: IFile[]
    allFiles: IFile[]
    columns: GridColumns<IFile>
    files: IFile[]
    sorting: SortConfig
}) {
    const onItemMouseDown = useCallback(
        (e: React.MouseEvent, file: IFile) => {
            const itemsOnScreen = calcItemsOnScreen(document.querySelector(`.${c.FileRow}`))
            const selection = new Selection(allFiles, selectedFiles, { itemsOnScreen })
            const selectedItems = selection.click(file, e.ctrlKey, e.shiftKey)
            setSelectedFiles(selectedItems)
        },
        [allFiles, selectedFiles, setSelectedFiles]
    )

    const onItemClick = useCallback((e: React.MouseEvent, file: IFile) => {
        // const selection = new Selection(allFiles, selectedFiles)
        const target = e.target as HTMLElement
        if (!target.matches("a.Name")) {
            return
        }
        e.preventDefault()
        void dispatcher.Open(file)
    }, [])

    const onItemDoubleClick = useCallback((e: React.MouseEvent, file: IFile) => {
        if (file == null) {
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
                    c.FileRow,
                    file.isFolder && c.IsFolder,
                    dispatcher.hasInnerSelection(file) && c.HasInnerSelection,
                    selectedFiles.includes(file) && c.Selected
                )
                return s
            }}
            columns={columns}
            visibleColumns={visibleGridColumns}
        />
    )
}

const GrdFiles = css`
    user-select: none;

    > table {
        width: 100%;
        > tbody > tr {
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
        > thead > tr,
        > tbody > tr {
            > .type {
                /* width: 35px; */
                text-overflow: clip;
                padding: 10px 5px;
                > .lnr {
                    font-size: 18px;
                }
            }
        }
        > thead {
            position: sticky;
            top: 83px;
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
