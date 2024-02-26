export type Meta<T, V> = {
    [K in keyof T]: V
}

export type MetaKeys<T extends object> = {
    [K in keyof T]: K
}
