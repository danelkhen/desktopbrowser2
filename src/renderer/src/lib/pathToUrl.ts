export function pathToUrl(p: string | undefined) {
    if (!p) return ""
    if (p.startsWith("//?")) return p.replace("//?", "")
    // if (!p.startsWith("/")) return `/${p}`
    return p
    // let s = p.replace(/\\/g, "/").replace(":", "")
    // if (s[0] === "/") {
    //     s = s.substring(1)
    // }
    // return s
}
