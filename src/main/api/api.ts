import { shell } from "electron"
import { IoDir } from "../io/IoDir"
import { IoFile } from "../io/IoFile"
import { Api } from "../../shared/Api"

export const Execute: Api["execute"] = async req => {
    const filename = req.path
    await shell.openExternal(filename)
}

export const Explore: Api["explore"] = async req => {
    console.log("shell.showItemInFolder", req.path)
    await shell.showItemInFolder(req.path)
}

export const Delete: Api["del"] = async req => {
    const path = req.path
    if (await IoFile.Exists(path)) {
        await IoFile.Delete(path)
        return
    }
    if (await IoDir.Exists(path)) {
        if (path.split("\\").length <= 2)
            throw new Error(
                "Delete protection, cannot delete path so short, should be at least depth of 3 levels or more"
            )
        await IoDir.del(path)
    }
}

export const trash: Api["trash"] = async req => {
    const path = req.path
    console.log("trash", path)
    await shell.trashItem(path)
}
