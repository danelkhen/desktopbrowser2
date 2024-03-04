export function iterableFirst<T>(iterable: Iterable<T>) {
    for (const item of iterable) {
        return item
    }
    return undefined
}
