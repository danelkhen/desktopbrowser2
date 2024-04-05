import { css } from "@emotion/css"
import React from "react"
import { c } from "../services/c"

export function progressStyle({
    position,
    start,
    color,
    background,
}: {
    position?: number
    start?: string
    color?: string
    background?: string
}) {
    return {
        "--progress": Math.round((position ?? 0) * 100) + "%",
        ...(start ? { "--progress-start": start } : {}),
        ...(start ? { "--progress-color": color } : {}),
        ...(start ? { "--bg": background } : {}),
    } as React.CSSProperties
}

const progressColor = `var(--progress-color, ${c.selection})`

export const progressMixin = css`
    background: linear-gradient(
        90deg,
        #000 0,
        ${progressColor} 1px,
        ${progressColor} var(--progress-start, 1px),
        ${progressColor} var(--progress),
        var(--bg, transparent) var(--progress),
        var(--bg, transparent) 100%
    );
`
