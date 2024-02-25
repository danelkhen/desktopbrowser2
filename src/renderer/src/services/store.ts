import { produce } from "immer"
import { AppState, initialAppState } from "./AppState"
import { Produce } from "../lib/Produce"

class AppStore {
    constructor(public _state: AppState) {}
    onChanged = () => {
        this.listeners.forEach(t => t())
    }
    private listeners: (() => void)[] = []
    subscribe = (listener: () => void) => {
        this.listeners = [...this.listeners, listener]
        return () => {
            this.listeners = this.listeners.filter(t => t !== listener)
        }
    }
    getSnapshot = () => {
        return this._state
    }
    set(v: AppState | Produce<AppStore>) {
        store._state = typeof v === "function" ? produce(store._state, v) : v
        store.onChanged()
    }
    update(v: Partial<AppState>) {
        const to = { ...store._state, ...v }
        this.set(to)
    }
}

export const store = new AppStore(initialAppState)
