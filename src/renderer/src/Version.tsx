import { useEffect } from "react"

export function Version() {
    useEffect(() => {
        // Display the current version
        const version = window.location.hash.substring(1)
        document.getElementById("version")!.innerText = version

        // Listen for messages
        // const { ipcRenderer } = require("electron")
        window.electron.ipcRenderer.on("message", function (event, text) {
            const container = document.getElementById("messages")!
            const message = document.createElement("div")!
            message.innerHTML = text
            container.appendChild(message)
        })
    }, [])
    return (
        <div>
            Current version: <span id="version">vX.Y.Z</span>
            <div id="messages"></div>
        </div>
    )
}
