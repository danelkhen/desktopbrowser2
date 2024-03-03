import { Values } from "./Values"

export const Column = {
    type: "type",
    name: "name",
    size: "size",
    modified: "modified",
    ext: "ext",
    hasInnerSelection: "hasInnerSelection",
} as const

export type Column = Values<typeof Column>
