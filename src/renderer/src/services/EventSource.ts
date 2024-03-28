import { IVlcStatus } from "../../../shared/Api"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventSource<T extends (...args: any[]) => any> {
    constructor(private onChange?: (x: T[]) => void) {}
    listeners: T[] = []
    on(h: T) {
        this.listeners = [...this.listeners, h]
        this.onChange?.(this.listeners)
    }
    off(h: T) {
        const l = this.listeners.length
        this.listeners = this.listeners.filter(t => t !== h)
        if (l === this.listeners.length) return
        this.onChange?.(this.listeners)
    }
    emit(v: IVlcStatus) {
        this.listeners.forEach(t => t(v))
    }
}
