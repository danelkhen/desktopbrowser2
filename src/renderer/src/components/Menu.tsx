import { css } from "@emotion/css"
import { colors } from "../GlobalStyle"
import { ReactNode } from "react"

export function Menu({ children }: { children?: ReactNode }) {
    return <div className={style}>{children}</div>
}
const style = css`
    display: none;
    flex-direction: column;
    position: absolute;
    border: 1px solid ${colors.bg2};
    background-color: ${colors.bg1};
    top: 40px;
    z-index: 10000;
    left: 0;
    /* &.show {
        .menu {
            display: flex;
        }
    } */
`
