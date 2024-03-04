export function calcItemsOnScreen(el: HTMLElement | null) {
    if (!el) return 1
    const itemRect = el.getBoundingClientRect()
    const containerRect = el.parentElement?.getBoundingClientRect()
    if (!containerRect) return 1
    return Math.max(Math.floor(containerRect.height / itemRect.height), 1)
}
