import { Column } from "../../../shared/Column"
import { SortColumn } from "../../../shared/SortColumn"

export function sortToUrl(cols: SortColumn[]): string {
    return cols.map(t => (t.Descending ? `${t.Name}_` : t.Name)).join(",")
}
export function urlToSort(sort: string | undefined): SortColumn[] {
    return (
        sort
            ?.split(",")
            .map(t =>
                t.endsWith("_")
                    ? ({ Name: removeLast(t, 1) as Column, Descending: true } as SortColumn)
                    : ({ Name: t as Column } as SortColumn)
            ) ?? []
    )
}

function removeLast(_this: string, x?: number): string {
    if (x == null) x = 1
    return _this.substring(0, _this.length - x)
}
