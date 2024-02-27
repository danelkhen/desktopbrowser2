import { Values } from "./Values"

export const Column = {
    type: "type",
    Name: "Name",
    Size: "Size",
    Modified: "Modified",
    Extension: "Extension",
    hasInnerSelection: "hasInnerSelection",
} as const

export type Column = Values<typeof Column>
