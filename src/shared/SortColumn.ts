import { Column } from "./Column"

export interface SortColumn {
    readonly name: Column
    readonly desc?: boolean
}
