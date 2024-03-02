import path from "path"

export function toCurrentPlatformPath(p: string) {
    if (process.platform === "win32") {
        if (p.startsWith("//")) return p
        if (p.startsWith("/")) {
            p = p.substring(1)
        }
        p = path.normalize(p)
    }
    return p
}
