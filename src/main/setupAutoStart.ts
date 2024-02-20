// const appFolder = path.dirname(process.execPath)
// const updateExe = path.resolve(appFolder, "..", "Update.exe")
// const exeName = path.basename(process.execPath)

import { app } from "electron"

export function setupAutoStart() {
    if (!app.isPackaged) {
        return
    }
    app.setLoginItemSettings({
        openAtLogin: true,
        // path: updateExe,
        // args: ["--processStart", `"${exeName}"`, "--process-start-args", '"--hidden"'],
    })
}
