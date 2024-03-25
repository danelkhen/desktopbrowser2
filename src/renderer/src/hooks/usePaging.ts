import { useLayoutEffect, useMemo } from "react"

export const pageSize = 200
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
        _pageIndex,
        pageIndex,
        // pageIndexInView,
        containerSelector,
        setPageIndexInView,
    }: {
        _pageIndex: number | null
        pageIndex: number
        pageIndexInView: number
        setPageIndexInView: (pageIndex: number) => void
        containerSelector: string
    }
) {
    pageIndex = pageIndex + 1 // Math.max(pageIndex, pageIndexInView) + 1
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
    usePaged({ containerSelector, setPageIndexInView, items: paged, disabled: _pageIndex === null })
    return paged
}

export function itemsInView<T>(items: T[], containerSelector: string) {
    const el = document.querySelector(containerSelector)
    if (!el) return []
    const res = Array.from(el.children)
    const scrollingEl = document.documentElement
    const elRect = el.getBoundingClientRect()
    const scrollingRect = scrollingEl.getBoundingClientRect()
    console.log("itemsInView", { elRect, scrollingRect })
    return res
}
export function usePaged<T>({
    containerSelector,
    setPageIndexInView,
    items,
    disabled,
}: {
    containerSelector: string
    setPageIndexInView: (pageIndex: number) => void
    items: T[]
    disabled?: boolean
}) {
    useLayoutEffect(() => {
        if (disabled) return
        if (!items.length) return
        const el = document.querySelector(containerSelector)
        if (!el) return
        console.log(items.length, el.children.length)
        if (items.length !== el.children.length) return
        let unmounted = false
        let first = true
        const observer = new IntersectionObserver(
            entries => {
                if (unmounted) return
                if (first) {
                    first = false
                    return
                }
                const entry = entries.find(t => t.isIntersecting)
                if (!entry) return
                const pageIndex = res.indexOf(entry.target)
                if (pageIndex === -1) return
                console.log("onPageIndexInView", pageIndex)
                setPageIndexInView(pageIndex)
            },
            { rootMargin: "0px", threshold: 1.0 }
        )
        const res = Array.from(el.querySelectorAll(`:scope > :nth-child(1), :scope > :nth-child(${pageSize + 1}n)`))
        console.log("observe", res.length, items.length)
        res.forEach(t => observer.observe(t))
        return () => {
            unmounted = true
            console.log("unobserve")
            observer.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [containerSelector, setPageIndexInView, items])
}
