export interface IWsReq {
    id?: string
    name: string
    args: unknown[]
    asyncIterable?: boolean
}

export interface IWsRes<T = unknown> {
    id?: string
    value: T
    asyncIterable?: boolean
    hasMore?: boolean
}
export interface IWsService {
    destroy(): unknown
}
