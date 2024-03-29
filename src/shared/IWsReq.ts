import EventEmitter from "events"

export interface IWsReq {
    type: "req"
    id?: string
    name: string
    arg: unknown
    // asyncIterable?: boolean
    // return?: boolean
    oneWay?: boolean
}

export interface IWsRes<T = unknown> {
    type: "res"
    id?: string
    value?: T
    error?: unknown
    // asyncIterable?: boolean
    // done?: boolean
}
export type IWsMessage = IWsReq | IWsRes
export interface IWsService {
    destroy(): unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMap<T> = Record<keyof T, any[]> | DefaultEventMap
export type DefaultEventMap = [never]
export interface IWsClient<T extends EventMap<T> = DefaultEventMap> extends EventEmitter<T> {
    invoke<T>(name: string, arg?: unknown): Promise<T>
    invokeOneWay(name: string, arg?: unknown): void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // onCallback(name: string, handler: (arg: any) => void): void
}

export interface IWsClientSocket {
    invoke(name: string, handler: (arg: unknown) => unknown): void
    callback(name: string, arg?: unknown): void
    destroy?: () => unknown
}
