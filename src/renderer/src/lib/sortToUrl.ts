import { ISorting } from "../../../shared/ISorting"

export function sortToUrl(cols: ISorting): string {
    return Object.entries(cols)
        .map(([key, dir]) => `${key}${dir === "desc" ? "_" : ""}`)
        .join(",")
}
export function urlToSort(sort: string | undefined): ISorting {
    const cfg: ISorting = {}
    for (const token of sort?.split(",") ?? []) {
        cfg[token.replace(/_$/, "")] = token.endsWith("_") ? "desc" : "asc"
    }
    return cfg
}
