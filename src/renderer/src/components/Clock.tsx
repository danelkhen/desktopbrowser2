import { DateTime } from "luxon"
import { useEffect, useState } from "react"
import { sleep } from "../lib/sleep"
import { css } from "@emotion/css"

export function Clock() {
    const [time, setTime] = useState(DateTime.now().toFormat("HH:mm\n ccc, MMM d"))
    useEffect(() => {
        let run = true
        void (async () => {
            while (run) {
                await sleep(5000)
                if (!run) return
                setTime(DateTime.now().toFormat("HH:mm\n ccc, MMM d"))
            }
        })()
        return () => {
            run = false
        }
    }, [])
    return <span className={style}>{time}</span>
}

const style = css`
    label: Clock;
    display: flex;
    flex-direction: row;
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    color: #999;
`
