export function iterableLast<T>(iterable: Iterable<T>) {
    let last: T | undefined = undefined
    for (const item of iterable) {
        last = item
    }
    return last
}
