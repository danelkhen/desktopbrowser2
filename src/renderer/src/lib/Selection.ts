import { isWin } from "./isWin"
import { iterableFirst } from "./iterableFirst"
import { iterableLast } from "./iterableLast"

export class Selection<T> {
    constructor(public ctx: { all: T[]; itemsOnScreen?: number; selected: Set<T> }) {}
    get all() {
        return this.ctx.all
    }
    get selected() {
        return this.ctx.selected
    }
    get itemsOnScreen() {
        return this.ctx.itemsOnScreen
    }
    clone(selected: Set<T>) {
        return new Selection({ ...this.ctx, selected })
    }
    has(item: T) {
        return this.selected.has(item)
    }
    hasOnly(item: T) {
        return this.selected.size === 1 && this.has(item)
    }

    toggle(item: T) {
        if (this.has(item)) {
            const x = new Set(this.selected)
            x.delete(item)
            return this.clone(x)
        }
        return this.clone(new Set(this.selected).add(item))
    }

    get lastSelected() {
        return iterableLast(this.selected)
    }

    get firstSelected() {
        return iterableFirst(this.selected)
    }

    click(item: T, e: MouseEvent | React.MouseEvent) {
        const ctrl = isWin ? e.ctrlKey : e.metaKey
        const shift = e.shiftKey
        const anchor = this.firstSelected

        if (ctrl) {
            return this.toggle(item)
        }
        if (shift && anchor) {
            const index1 = this.all.indexOf(anchor)
            const index2 = this.all.indexOf(item)

            const minIndex = Math.min(index1, index2)
            const maxIndex = Math.max(index1, index2)
            const slice = this.all.slice(minIndex, maxIndex + 1)
            return this.clone(new Set([anchor, ...slice.filter(t => t !== anchor)]))
        }
        if (this.hasOnly(item)) {
            return this
        }
        return this.clone(new Set([item]))
    }
    keyDown(e: KeyboardEvent) {
        const keyCode = e.key
        // const ctrl = isWin ? e.ctrlKey : e.metaKey
        const shift = e.shiftKey
        const lastActive = this.lastSelected
        let offset = 0
        const pageSize = this.ctx.itemsOnScreen ?? 1
        if (keyCode === "ArrowDown") offset = 1
        else if (keyCode === "ArrowUp") offset = -1
        else if (keyCode === "PageDown") offset = pageSize
        else if (keyCode === "PageUp") offset = pageSize * -1
        else return this

        if (!lastActive) {
            e.preventDefault()
            return this.clone(new Set([this.all[0]!]))
        }
        const sibling = getSiblingOrEdge(this.all, lastActive, offset)
        if (!sibling || sibling === lastActive) {
            return this
        }

        e.preventDefault()
        if (shift) {
            if (this.has(sibling)) {
                return this
            }
            return this.clone(new Set(this.selected).add(sibling))
        }
        if (this.hasOnly(sibling)) {
            return this
        }
        return this.clone(new Set([sibling]))
    }
}

function getSiblingOrEdge<T>(list: T[], item: T, offset: number) {
    if (!offset) return item
    let index = list.indexOf(item)
    const newIndex = (index += offset)
    if (newIndex < 0 || newIndex >= list.length) {
        if (offset > 0) return list[list.length - 1]
        return list[0]
    }
    return list[newIndex]
}
