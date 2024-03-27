export interface IWsReq {
    type: "req"
    id?: string
    name: string
    args: unknown[]
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

// export function isWsReq(x: unknown): x is IWsReq {
//     return typeof x === "object" && x !== null && (x as Partial<IWsReq>).type === "req"
// }

export interface IWsClient {
    invoke<T>(name: string, arg?: unknown): Promise<T>
    onCallback?: (name: string, args: unknown[]) => void
}
