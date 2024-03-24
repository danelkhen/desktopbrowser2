import { css } from "@emotion/css"
import React from "react"

export function progressStyle(position: number | undefined, start?: string) {
    return {
        "--progress": Math.round((position ?? 0) * 100) + "%",
        ...(start ? { "--progress-start": start } : {}),
    } as React.CSSProperties
}

export const progressMixin = css`
    background: linear-gradient(
        90deg,
        #000 0,
        #6b9cff 1px,
        #6b9cff var(--progress-start, 1px),
        #6b9cff var(--progress),
        var(--bg, transparent) var(--progress),
        var(--bg, transparent) 100%
    );
`
