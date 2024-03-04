import { Column } from "src/shared/Column"
import { SortColumn } from "../../../shared/SortColumn"

export function sortToUrl(cols: SortColumn[]): string {
    return cols.map(t => (t.desc ? `${t.name}_` : t.name)).join(",")
}
export function urlToSort(sort: string | undefined): SortColumn[] {
    return (
        sort
            ?.split(",")
            .map(t =>
                t.endsWith("_")
                    ? ({ name: removeLast(t, 1) as Column, desc: true } as SortColumn)
                    : ({ name: t as Column } as SortColumn)
            ) ?? []
    )
}

function removeLast(_this: string, x?: number): string {
    if (x === undefined) x = 1
    return _this.substring(0, _this.length - x)
}
