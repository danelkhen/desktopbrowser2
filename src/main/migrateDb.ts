import { IFileMeta } from "../shared/IFileMeta"
import { levelDb } from "./services"

export async function migrateDb() {
    const sub = levelDb.sublevel<string, IFileMeta>("files", { valueEncoding: "json" })
    console.log("files")
    // for await (const key of sub.keys()) {
    //     // console.log(key)
    //     console.log(await sub.get(key))
    // }
    // await sub.del("test")
    console.log("all")
    for await (const [key, value] of levelDb.iterator<string, IFileMeta>({ gt: "files/", lt: "files@" })) {
        const newKey = key.replace("files/", "")
        console.log("Migrating", { key, value, newKey })
        await sub.put(newKey, value)
        await levelDb.del(key)
    }
}
