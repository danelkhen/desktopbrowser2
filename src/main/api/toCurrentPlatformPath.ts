export function toCurrentPlatformPath(p: string) {
    if (process.platform === "win32") {
        if (p.startsWith("//")) return p
        if (p.startsWith("/")) return p.substring(1)
    }
    return p
}
