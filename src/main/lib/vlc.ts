import axios, { isAxiosError } from "axios"
import child_process from "child_process"
import { pathToFileURL } from "url"
import { sleep } from "./sleep"

const exe =
    process.platform === "win32"
        ? "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe"
        : "/Applications/VLC.app/Contents/MacOS/VLC"
const pwd = "desktopbrowser2"
const port = 9090
const host = "127.0.0.1"
const user = ""

export async function openVlc() {
    await child_process.spawn(
        `${exe} --extraintf http --http-host ${host} --http-port ${port} --http-password ${pwd}`,
        {
            detached: true,
            shell: true,
        }
    )
}

export async function vlcPlay(file: string) {
    if (process.platform === "darwin" && file.startsWith("/")) {
        file = pathToFileURL(file).toString()
    }
    let res = await _vlcPlay(file)
    if (res) return
    await sleep(500)
    res = await _vlcPlay(file)
    if (res) return
    await openVlc()
    await sleep(1000)
    res = await _vlcPlay(file)
    if (res) return
    throw new Error()
}
export async function _vlcPlay(file: string) {
    try {
        const auth = `${user}:${pwd}`
        const res = await axios(`http://${host}:${port}/requests/status.xml`, {
            headers: { Authorization: `Basic ${btoa(auth)}` },
            params: { command: "in_play", input: file },
        })
        return res
    } catch (e) {
        return (isAxiosError(e) && e.response) ?? null
    }
}
