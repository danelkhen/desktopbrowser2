import { useMemo } from "react"

export function usePaging<T>(items: T[], { pageIndex, pageSize = 100 }: { pageIndex: number; pageSize: number }) {
    return useMemo(() => {
        const totalPages = Math.ceil(items.length / pageSize)
        let pageIndex2 = pageIndex
        if (pageIndex2 >= totalPages) {
            pageIndex2 = totalPages - 1
        }
        if (pageIndex2 < 0) {
            pageIndex2 = 0
        }
        const from = pageIndex2 * pageSize
        const until = from + pageSize
        const paged = items.slice(from, until)
        return paged
    }, [items, pageIndex, pageSize])
}
