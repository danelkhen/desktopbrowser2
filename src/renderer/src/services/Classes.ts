import { css } from "@emotion/css"

export const IsFolder = "IsFolder"
export const IsFile = "IsFile"
export const HasInnerSelection = "HasInnerSelection"
export const Selected = "Selected"
export const sorted = "sorted"
export const asc = "asc"
export const desc = "desc"

export const FileRow = css`
    label: FileRow;
    transition: all 0.3s ease;
    color: #999;
    &:hover {
        background-color: #000;
        color: #a276f8;
        td .Name {
            text-decoration: none;
            cursor: pointer;
        }
    }
    &.${Selected} {
        color: #fff;
        background-color: #a276f8;
        transition: all 0.3s ease;
    }

    &.${IsFolder}.${HasInnerSelection}.${Selected} {
        color: rgba(238, 238, 238, 0.7);
    }
    &.${HasInnerSelection} {
        color: rgba(238, 238, 238, 0.3);
    }
`

export const Classes = {
    FileRow,
    IsFolder,
    IsFile,
    HasInnerSelection,
    Selected,
    sorted,
    asc,
    desc,
} as const

console.log({ FileRow })
// console.log({ css, cx, classnames })
