import path from "path"
import { AppDb } from "./AppDb"
import { config } from "./config"
import { LevelDb } from "./utils/LevelDb"

const database2 = path.join(config.userDataDir, "db.level")
const levelDb = new LevelDb(database2)
export const appDb = new AppDb(levelDb)
