import _ from "lodash"
import { useMemo } from "react"
import { ColumnKey, GridColumns } from "../components/Grid"

export interface SortConfig {
    readonly isDescending: Record<ColumnKey, boolean>
    readonly active: readonly ColumnKey[]
}

export function useSorting<T>(items: T[], config: SortConfig, gridColumns: GridColumns<T>) {
    console.log("useSorting", config)
    return useMemo(() => {
        function getOrderBy() {
            const activeKeys = config.active
            return {
                keys: activeKeys.map(key => gridColumns[key].sortGetter ?? gridColumns[key].getter ?? key),
                order: activeKeys.map(key => !!config.isDescending[key]),
            }
        }

        const by = getOrderBy()

        // const sorted = items[orderBy](...by)
        const sorted = _.orderBy<T>(
            items,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            by.keys as any,
            by.order.map(t => (t ? "desc" : "asc"))
        )
        return sorted
    }, [config.active, config.isDescending, gridColumns, items])
}
