import { Tray } from "electron"
import trayIcon from "../../../resources/clapperboard-16x16.png?asset"
import { showMainWindow } from "./setupMainWindow"

let tray: Tray | null = null

export async function setupTray() {
    tray = new Tray(trayIcon)
    tray.on("click", () => showMainWindow())
}
