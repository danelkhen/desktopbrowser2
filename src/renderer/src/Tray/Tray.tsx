import { css } from "@emotion/css"
import { Version } from "@renderer/Version"
import { useCallback, useState } from "react"
import { api } from "../services/api"
import { injectGlobalStyle } from "./GlobalStyle"

const TrayDiv = css`
    display: flex;
    flex-direction: column;
    > * {
        margin: 4px 0;
        padding: 6px;
    }
`
injectGlobalStyle()
export function Tray() {
    const [status, setStatus] = useState<string | undefined>()

    const checkForUpdates = useCallback(async () => {
        const res = await api.checkForUpdates()
        setStatus(JSON.stringify(res))
    }, [])

    return (
        <div className={TrayDiv}>
            <a href="/" target="_blank" rel="noreferrer">
                Open
            </a>
            {/* <button onClick={() => open()}>Open</button> */}
            <button onClick={() => api.appHide()}>Close</button>
            <button onClick={() => exit()}>Exit</button>
            <button onClick={() => checkForUpdates()}>Check for updates</button>
            <div>{APP_VERSION}</div>
            <div>{status}</div>
            <Version />
        </div>
    )
}

// async function open() {
//     await api.appOpen()
// }
async function exit() {
    await api.appExit()
}

// window.electron.ipcRenderer.send("ping")
