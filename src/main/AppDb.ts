import { IFileMeta } from "../shared/IFileMeta"
import { LevelDbCollection, LevelDb } from "./lib/LevelDb"

export class AppDb {
    readonly files: LevelDbCollection<IFileMeta>
    constructor(public db: LevelDb) {
        this.files = new LevelDbCollection<IFileMeta>(this.db, "files")
    }
}
