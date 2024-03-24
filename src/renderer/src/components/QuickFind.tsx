import { useRef, useState } from "react"
import { sleep } from "../lib/sleep"
import { IFile } from "../../../shared/IFile"
import { css, cx } from "@emotion/css"
import { Input } from "@mui/material"

export function QuickFind({ allFiles, onFindFiles }: QuickFindProps) {
    const [value, setValue] = useState("")
    const versionRef = useRef(0)

    function onChange(value: string) {
        console.log("setQuickFindText", value)
        versionRef.current++
        setValue(value)
        if (!value) return
        quickFind(value)
        void scheduleClear()
    }
    async function scheduleClear() {
        const version = versionRef.current
        await sleep(2000)
        if (version !== versionRef.current) return
        onChange("")
    }

    function quickFind(value: string) {
        const list = allFiles
        const s = value.toLowerCase()
        const item = list.find(t => t.name.toLowerCase().includes(s))
        if (!item) return
        onFindFiles([item])
    }

    return (
        <Input
            id="tbQuickFind"
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
            className={cx(style, value.length > 0 && "HasValue")}
        />
    )
}

export interface QuickFindProps {
    allFiles: IFile[]
    onFindFiles(files: IFile[]): void
}

const style = css`
    label: QuickFind;
    && {
        position: absolute;
    }
    top: 0;
    right: 0;
    border: 0;
    background-color: transparent;
    opacity: 0;
    z-index: -1;

    &.HasValue {
        opacity: 1;
        z-index: 1;
    }
`
