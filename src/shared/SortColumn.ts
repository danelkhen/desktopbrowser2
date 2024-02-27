import { Column } from "./Column"

export interface SortColumn {
    readonly Name: Column
    readonly Descending?: boolean
}
