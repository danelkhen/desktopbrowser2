import { Level } from "level"
import * as path from "path"
import { config } from "./config"
import { zipEntries } from "./api/zipEntries"

const database2 = path.join(config.userDataDir, "db.level")
export const levelDb = new Level<string, unknown>(database2, { valueEncoding: "json" })
export const db = {
    // files: levelDb.sublevel<string, IFileMeta>("files", { valueEncoding: "json" }),
    folderSelection: levelDb.sublevel<string, string>("folderSelection", {}),
    getFolderSelections: async (keys: string[]) => {
        return zipEntries(keys, await db.folderSelection.getMany(keys))
    },
}
