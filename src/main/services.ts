import { Level } from "level"
import path from "path"
import { IFileMeta } from "../shared/IFileMeta"
import { config } from "./config"

const database2 = path.join(config.userDataDir, "db.level")
export const levelDb = new Level<string, unknown>(database2, { valueEncoding: "json" })
export const db = {
    files: levelDb.sublevel<string, IFileMeta>("files", { valueEncoding: "json" }),
}
