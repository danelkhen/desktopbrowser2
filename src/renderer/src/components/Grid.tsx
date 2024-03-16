import { css, cx } from "@emotion/css"
import React, { ReactNode } from "react"
import { colors } from "../GlobalStyle"
import { c } from "../services/c"

export interface GridColumn<T, V> {
    getter?: (item: T, index: number) => V
    cell?: (item: T, index: number) => ReactNode
    header?: () => ReactNode
    sortGetter?: (item: T) => unknown
    descendingFirst?: boolean
    width?: string | number
}
export type GridColumns<T> = {
    [k: string]: GridColumn<T, unknown>
}

export type ColumnKey = string
export interface GridProps<T> {
    columns: GridColumns<T>
    className?: string
    items: T[]
    // headers?: Partial<Meta<K, () => ReactElement>>
    // children?: { [key: ColumnKey]: (item: T, index: number) => ReactNode }
    // columns: ColumnsConfig<T, K>

    getRowClass?: (item: T) => string
    onItemClick?: (e: React.MouseEvent, item: T) => void
    onItemMouseDown?: (e: React.MouseEvent, item: T) => void
    onItemDoubleClick?: (e: React.MouseEvent, item: T) => void

    getHeaderClass?: (column: ColumnKey) => string
    getCellClass?: (column: ColumnKey, item: T) => string
    orderBy?: (column: ColumnKey) => void
    visibleColumns: ColumnKey[]
}

export function Grid<T>({
    columns,
    getRowClass,
    onItemClick,
    onItemMouseDown,
    onItemDoubleClick,
    items,
    orderBy,
    className,
    getHeaderClass,
    getCellClass,
    visibleColumns,
}: GridProps<T>) {
    return (
        <div className={cx(containerStyle, className)}>
            <table className={tableStyle}>
                <colgroup>
                    {visibleColumns?.map(col => <col key={col} style={{ width: columns[col]?.width }}></col>)}
                </colgroup>
                <thead>
                    <tr>
                        {visibleColumns?.map(col => (
                            <th key={col} className={getHeaderClass?.(col)} onClick={() => orderBy?.(col)}>
                                {columns[col].header?.() ?? col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items?.map((item, itemIndex) => (
                        <tr
                            key={itemIndex}
                            className={getRowClass?.(item)}
                            onMouseDown={e => onItemMouseDown?.(e, item)}
                            onClick={e => onItemClick?.(e, item)}
                            onDoubleClick={e => onItemDoubleClick?.(e, item)}
                        >
                            {visibleColumns?.map(col => (
                                <td key={col} className={getCellClass?.(col, item)}>
                                    {columns[col].cell?.(item, itemIndex) ?? (
                                        <span>{columns[col].getter?.(item, itemIndex) as ReactNode}</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const tableStyle = css`
    label: Grid;
    border-collapse: collapse;
    table-layout: fixed;
    border-spacing: 0;

    > thead {
        > tr {
            border-bottom: 1px solid ${colors.bg2};
            > th {
                padding: 4px 8px;
                white-space: nowrap;
                cursor: default;
                font-weight: normal;
                text-align: left;
                vertical-align: top;
                box-sizing: border-box;
                &:hover {
                    background-color: ${colors.bg2};
                }
                &.${c.sorted} {
                    &.${c.asc} {
                        background-color: ${colors.bg2};
                    }
                    &.${c.desc} {
                        background-color: ${colors.bg3};
                    }
                }
            }
        }
    }

    > tfoot {
        > tr {
            > th {
                padding: 4px 8px;
                white-space: nowrap;
                cursor: pointer;
                font-weight: bold;
                > button {
                    width: 100%;
                    min-height: 100%;
                    border: none;
                    background-color: inherit;
                    padding: 4px;
                }
            }
            &:hover {
                outline: 1px solid #ccc;
            }
        }
    }
`
const containerStyle = css`
    label: GridContainer;
    > .Pager {
        display: inline-block;
        margin: 0 5px;
        > .Pages > .Page {
            display: inline-block;
            width: 20px;
            line-height: 20px;
        }
        > .PagerInfo {
            display: inline-block;
            margin: 0 5px;
        }

        > .NextPage {
            visibility: hidden;
        }
        > .PrevPage {
            visibility: hidden;
        }
    }

    > .Search {
        display: inline-block;
    }
`
