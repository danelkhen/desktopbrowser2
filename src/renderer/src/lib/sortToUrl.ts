import { SortConfig } from "../../../shared/SortConfig"

export function sortToUrl(cols: SortConfig): string {
    return Object.entries(cols)
        .map(([key, dir]) => `${key}${dir === "desc" ? "_" : ""}`)
        .join(",")
}
export function urlToSort(sort: string | undefined): SortConfig {
    const cfg: SortConfig = {}
    for (const token of sort?.split(",") ?? []) {
        cfg[token.replace(/_$/, "")] = token.endsWith("_") ? "desc" : "asc"
    }
    return cfg
}
