import { css } from "@emotion/css"
import { Button, Link, List, ListItem } from "@mui/material"
import { Version } from "@renderer/Version"
import { useCallback, useState } from "react"
import { api } from "../services/api"

// injectGlobalStyle()
export function Tray() {
    const [status, setStatus] = useState<string | undefined>()

    const checkForUpdates = useCallback(async () => {
        const res = await api.checkForUpdates()
        setStatus(JSON.stringify(res))
    }, [])

    return (
        <div className="flex-col">
            <List>
                <ListItem>
                    <Button fullWidth LinkComponent={Link} href="/" target="_blank" rel="noreferrer">
                        Open
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth onClick={() => api.appHide()}>
                        Close
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth onClick={() => api.appExit()}>
                        Exit
                    </Button>
                </ListItem>
                <ListItem>
                    <Button fullWidth onClick={() => checkForUpdates()}>
                        Check for updates
                    </Button>
                </ListItem>
            </List>
            <div>{status}</div>
            <Version />
        </div>
    )
}

// window.electron.ipcRenderer.send("ping")
