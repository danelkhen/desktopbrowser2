export type MetaKeys<T extends object> = {
    [K in keyof T]: K
}
