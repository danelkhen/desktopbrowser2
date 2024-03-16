import { css } from "@emotion/css"
import { colors } from "../GlobalStyle"
import { ReactNode } from "react"

export function Menu({ children }: { children?: ReactNode }) {
    return <div className={style}>{children}</div>
}
const style = css`
    display: flex;
    flex-direction: column;
    border: 1px solid ${colors.bg2};
    background-color: ${colors.bg1};
`
