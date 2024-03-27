export interface IWsReq {
    type: "req"
    id?: string
    name: string
    arg: unknown
    asyncIterable?: boolean
    return?: boolean
    oneWay?: boolean
}

export interface IWsRes<T = unknown> {
    type: "res"
    id?: string
    value: T
    asyncIterable?: boolean
    done?: boolean
}
export type IWsMessage = IWsReq | IWsRes
export interface IWsService {
    destroy(): unknown
}

export interface IWsClient {
    invoke<T>(name: string, arg?: unknown): Promise<T>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCallback(name: string, handler: (arg: any) => void): void
}
