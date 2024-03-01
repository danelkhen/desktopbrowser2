import { css } from "@emotion/css"

const IsFolder = "IsFolder"
const IsFile = "IsFile"
const HasInnerSelection = "HasInnerSelection"
const Selected = "Selected"
const sorted = "sorted"
const asc = "asc"
const desc = "desc"

const FileRow = css`
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

export const c = {
    FileRow,
    IsFolder,
    IsFile,
    HasInnerSelection,
    Selected,
    sorted,
    asc,
    desc,
} as const
