import { isWindows } from "../lib/isWindows"

export function normalizePath(path: string | undefined): string {
    if (!path) {
        path = "/"
        return path
    }
    if (isWindows() && path.startsWith("/") && path !== "/") {
        const list = [
            // Drive letter, /C -> C:
            [/^\/([a-zA-Z])$/, "$1:/"],
            // Drive letter, /C/ggg -> C:/ggg
            [/^\/([a-zA-Z])\/(.*)$/, "$1:/$2"],
            // Network share: /mycomp -> //mycomp
            [/^\/([a-zA-Z0-9_-][a-zA-Z0-9_\-.]+)$/, "//$1"],
            // Network share: /mycomp/myshare -> //mycomp/myshare
            [/^\/([a-zA-Z0-9_-][a-zA-Z0-9_\-.]+)\/(.*)$/, "//$1/$2"],
        ] as const
        for (const regex of list) {
            const path2 = path.replace(regex[0], regex[1]) as string // TODO:
            if (path2 !== path) {
                path = path2
                break
            }
        }
    }
    return path
}
