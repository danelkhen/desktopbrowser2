export interface IWsReq {
    id?: string
    name: string
    args: unknown[]
    asyncIterable?: boolean
    return?: boolean
}

export interface IWsRes<T = unknown> {
    id?: string
    value: T
    asyncIterable?: boolean
    done?: boolean
}
export interface IWsService {
    destroy(): unknown
}
