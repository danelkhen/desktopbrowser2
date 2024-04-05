import axios, { isAxiosError } from "axios"
import child_process from "child_process"
import log from "electron-log/main"
import { VLC } from "node-vlc-http"
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

export function connectToVlc() {
    return new Promise<VLC | null>(resolve => {
        const vlc = new VLC({ host, port, username: user, password: pwd, autoUpdate: false, maxTries: 1 })
        const handler1 = () => {
            vlc.off("error", handler1)
            vlc.off("connect", handler2)
            resolve(null)
        }
        const handler2 = () => {
            vlc.off("error", handler1)
            vlc.off("connect", handler2)
            resolve(vlc)
        }
        vlc.on("error", handler1)
        vlc.on("connect", handler2)
    })
}

export async function connectOrOpenVlc() {
    let vlc = await connectToVlc()
    if (vlc) return vlc
    await sleep(100)
    vlc = await connectToVlc()
    if (vlc) return vlc
    await openVlc()
    vlc = await connectToVlc()
    if (vlc) return vlc
    await sleep(500)
    vlc = await connectToVlc()
    if (vlc) return vlc
    await sleep(1000)
    vlc = await connectToVlc()
    if (vlc) return vlc
    await sleep(1000)
    vlc = await connectToVlc()
    if (!vlc) {
        throw new Error("Cannot connect or open vlc")
    }
    return vlc
}

export async function openVlc() {
    const cmd = `"${exe}" --extraintf http --http-host ${host} --http-port ${port} --http-password ${pwd}`
    const { pid, exitCode } = await child_process.spawn(cmd, { detached: true, shell: true })
    log.info("openVlc", { cmd, pid, exitCode })
}

export async function vlcPlay(file: string) {
    const mrl = pathToFileURL(file).toString()
    const vlc = await connectOrOpenVlc()
    await vlc.addToQueueAndPlay(mrl)
    // // if (process.platform === "darwin" && file.startsWith("/")) {
    // //     file = pathToFileURL(file).toString()
    // // }
    // let res = await _vlcPlay(mrl)
    // if (res) return
    // await sleep(500)
    // res = await _vlcPlay(mrl)
    // if (res) return
    // await openVlc()
    // await sleep(1000)
    // res = await _vlcPlay(mrl)
    // if (res) return
    // throw new Error()
}
export async function _vlcPlay(mrl: string) {
    try {
        const auth = `${user}:${pwd}`
        const params = { command: "in_play", input: mrl }
        const res = await axios(`http://${host}:${port}/requests/status.json`, {
            headers: { Authorization: `Basic ${btoa(auth)}` },
            params,
        })
        log.info("vlcPlay res", params, res.status, res.data)
        return res
    } catch (e) {
        return (isAxiosError(e) && e.response) ?? null
    }
}
