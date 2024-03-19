import { levelDb } from "./services"

export async function migrateDb() {
    const sub = levelDb.sublevel<string, { selectedFiles?: string[] }>("files", { valueEncoding: "json" })
    const sub2 = levelDb.sublevel<string, string>("folderSelection", {})
    console.log("files")
    // for await (const key of sub.keys()) {
    //     // console.log(key)
    //     console.log(await sub.get(key))
    // }
    // await sub.del("test")
    console.log("all")
    for await (const [key, value] of levelDb.iterator<string, { selectedFiles?: string[] }>({
        gt: "files/",
        lt: "files@",
    })) {
        const newKey = key.replace("files/", "")
        console.log("Migrating", { key, value, newKey })
        await sub.put(newKey, value)
        await levelDb.del(key)
    }
    for await (const [key, value] of sub.iterator()) {
        console.log("Migrating2", { key, value })
        const file = value.selectedFiles?.[0]
        if (!file) continue
        await sub2.put(key, file)
        await sub.del(key)
    }
}
