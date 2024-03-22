import { css } from "@emotion/css"
import { c } from "./c"

export const fileRow = css`
    label: fileRow;
    transition: all 0.3s ease;
    color: #999;
    &:hover {
        background-color: #000;
        color: #a276f8;
        td .${c.name} {
            text-decoration: none;
            cursor: pointer;
        }
    }
    &.${c.selected} {
        color: #fff;
        background-color: #a276f8;
        transition: all 0.3s ease;
        &:hover {
            background-color: #a97eff;
        }
    }

    &.${c.isFolder}.${c.hasInnerSelection}.${c.selected} {
        color: rgba(238, 238, 238, 0.7);
    }
    &.${c.hasInnerSelection} {
        color: rgba(238, 238, 238, 0.3);
    }
`
