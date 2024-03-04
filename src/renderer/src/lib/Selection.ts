import _ from "lodash"
import { arrayItemsEqual } from "./arrayItemsEqual"

export class Selection<T> {
    constructor(
        public readonly all: T[],
        public selected: T[],
        public opts: { itemsOnScreen?: number }
    ) {}

    toggle(list: T[], item: T): void {
        const index = list.indexOf(item)
        if (index < 0) list.push(item)
        else list.splice(index, 1)
    }

    get selectedItem() {
        return this.selected[this.selected.length - 1]
    }

    click(item: T, ctrl: boolean, shift: boolean): T[] {
        let sel = [...this.selected]
        const anchor = this.selected[0]

        if (ctrl) {
            this.toggle(sel, item)
        } else if (shift && anchor != null) {
            const index1 = this.all.indexOf(anchor)
            const index2 = this.all.indexOf(item)

            const minIndex = Math.min(index1, index2)
            const maxIndex = Math.max(index1, index2)
            const slice = this.all.slice(minIndex, maxIndex + 1)
            sel = [anchor, ...slice.filter(t => t != anchor)]
        } else {
            sel = [item]
        }

        if (arrayItemsEqual(sel, this.selected)) {
            return this.selected
        }
        return sel
    }
    keyDown(e: KeyboardEvent): T[] {
        const keyCode = e.key
        const ctrl = e.ctrlKey
        const lastActive = this.selectedItem
        let offset = 0
        const pageSize = this.opts.itemsOnScreen ?? 1
        if (keyCode === "ArrowDown") offset = 1
        else if (keyCode === "ArrowUp") offset = -1
        else if (keyCode === "PageDown") offset = pageSize
        else if (keyCode === "PageUp") offset = pageSize * -1
        else {
            return this.selected
        }
        if (!lastActive) {
            e.preventDefault()
            this.set([this.all[0]])
            return this.selected
        }
        const sibling = getSiblingOrEdge(this.all, lastActive, offset)
        if (sibling == null || sibling === lastActive) {
            return this.selected
        }

        e.preventDefault()
        if (ctrl) {
            this.add(sibling)
            return this.selected
        }
        this.set([sibling])
        return this.selected
    }

    add(item: T) {
        if (this.selected.includes(item)) return this.selected
        const sel = [...this.selected]
        sel.push(item)
        this.set(sel)
    }
    set(sel: T[]) {
        if (sel == this.selected || !_.difference(sel, this.selected).length) {
            return
        }
        this.selected = sel
    }
}

function getSiblingOrEdge<T>(list: T[], item: T, offset: number): T {
    if (offset == null || offset == 0) return item
    let index = list.indexOf(item)
    const newIndex = (index += offset)
    if (newIndex < 0 || newIndex >= list.length) {
        if (offset > 0) return list[list.length - 1]
        return list[0]
    }
    return list[newIndex]
}
