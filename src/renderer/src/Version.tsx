import { useEffect, useState } from "react"

export function Version() {
    const [messages, setMessages] = useState<string[]>([])
    useEffect(() => {
        const off = window.electron.ipcRenderer.on("message", (event, text) => {
            setMessages(t => [...t, text])
        })
        return () => {
            off()
        }
    }, [])
    return (
        <div>
            Current version: <span id="version">v{APP_VERSION}</span>
            <div>
                {messages.map((message, i) => (
                    <div key={i}>{message}</div>
                ))}
            </div>
        </div>
    )
}
