import _ from "lodash"
import { useMemo } from "react"
import { GridColumns } from "../components/Grid"
import { SortConfig } from "../../../shared/SortConfig"

export function useSorting<T>(items: T[], config: SortConfig, gridColumns: GridColumns<T>) {
    console.log("useSorting", config)
    return useMemo(() => {
        function getOrderBy() {
            const activeKeys = Object.keys(config)
            return {
                keys: activeKeys.map(key => gridColumns[key]?.sortGetter ?? gridColumns[key]?.getter ?? key),
                order: activeKeys.map(key => config[key] === "desc"),
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
    }, [config, gridColumns, items])
}
