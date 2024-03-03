import path from "path"
import { config } from "../config"
import fs from "fs/promises"

const settingsFile = path.join(config.userDataDir, "settings.json")

export interface Settings {
    useVlcForVideoFiles?: boolean
}
export async function loadSettings() {
    try {
        return JSON.parse(await fs.readFile(settingsFile, "utf-8")) as Settings
    } catch (e) {
        return null
    }
}
export async function saveSettings(settings: Settings) {
    const exists = await fs.stat(settingsFile).catch(() => null)
    if (exists && exists.isFile() && exists.size > 4) {
        await fs.cp(settingsFile, settingsFile + ".bak")
    }
    await fs.writeFile(settingsFile, JSON.stringify(settings, null, 4))
}
