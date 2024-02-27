import { glob } from "glob"
async function main() {
    const res = await glob("**/*.ts", { stat: true, withFileTypes: true })
    console.log(res)
}
main()
