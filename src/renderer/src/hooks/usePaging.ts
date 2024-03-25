import { useLayoutEffect, useMemo } from "react"

export const pageSize = 50 // 200
export function usePaging<T>(items: T[], { pageIndex }: { pageIndex: number }) {
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
    }, [items, pageIndex])
}

export function useShowMore<T>(
    items: T[],
    {
        pageIndex,
        containerSelector,
        setPageIndex,
    }: { pageIndex: number; setPageIndex: (pageIndex: number) => void; containerSelector: string }
) {
    pageIndex++
    const paged = useMemo(() => {
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
        const paged = items.slice(0, until)
        return paged
    }, [items, pageIndex])
    usePaged({ containerSelector, onPageIndexInView: setPageIndex, items: [paged] })
    return paged
}

export function usePaged<T>({
    containerSelector,
    onPageIndexInView,
    items,
}: {
    containerSelector: string
    onPageIndexInView: (pageIndex: number) => void
    items: T[]
}) {
    useLayoutEffect(() => {
        if (!items.length) return
        const el = document.querySelector(containerSelector)
        if (!el) return
        const observer = new IntersectionObserver(
            entries => {
                const entry = entries.find(t => t.isIntersecting)
                if (!entry) return
                const pageIndex = res.indexOf(entry.target)
                if (pageIndex === -1) return
                onPageIndexInView(pageIndex)
            },
            { rootMargin: "0px", threshold: 1.0 }
        )
        const res = Array.from(el.querySelectorAll(`:scope > :nth-child(1), :scope > :nth-child(${pageSize + 1}n)`))
        console.log("observe", res.length, items.length)
        res.forEach(t => observer.observe(t))
        return () => {
            console.log("unobserve")
            observer.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerSelector, onPageIndexInView, items])
}
