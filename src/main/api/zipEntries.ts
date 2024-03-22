export function zipEntries<T>(keys: string[], values: T[]): Record<string, T> {
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]))
}
