import { shell } from "electron"
import { IoDir } from "../io/IoDir"
import { IoFile } from "../io/IoFile"
import { FileService } from "../shared/FileService"

export const Execute: FileService["execute"] = async req => {
    const filename = req.Path
    await shell.openExternal(filename)
}

export const Explore: FileService["explore"] = async req => {
    console.log("shell.showItemInFolder", req.Path)
    await shell.showItemInFolder(req.Path)
}

export const Delete: FileService["del"] = async req => {
    const path = req.Path
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

export const trash: FileService["trash"] = async req => {
    const path = req.Path
    console.log("trash", path)
    await shell.trashItem(path)
}
