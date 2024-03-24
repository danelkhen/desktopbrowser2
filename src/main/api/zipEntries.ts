export function zipEntries<T>(keys: string[], values: T[]): Record<string, T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.fromEntries(keys.map((key, i) => [key, values[i]])) as any
}
