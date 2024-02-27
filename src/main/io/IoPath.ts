import * as path from "path"
import { removeLast } from "../lib/removeLast"
import { io } from "./io"

export class IoPath {
    Value: string

    constructor(path: string) {
        this.Value = path
    }

    get IsRoot(): boolean {
        if (this.IsEmpty) return false
        const abs = this.ToAbsolute()
        return path.posix.parse(abs.Value).root === abs.Value
    }
    get IsEmpty(): boolean {
        return !this.Value
    }

    ToAbsolute(): IoPath {
        if (this.IsEmpty) return this
        if (path.posix.isAbsolute(this.Value)) return this
        return new IoPath(path.posix.resolve(this.Value))
    }
    async ToAbsoluteExact(): Promise<IoPath> {
        if (this.IsEmpty) return this
        return new IoPath(path.posix.resolve(this.Value))
    }

    toString(): string {
        return this.Value
    }

    get IsFile(): Promise<boolean | undefined> {
        return io.fileExists(this.Value)
    }
    get IsDirectory(): Promise<boolean | undefined> {
        return io.dirExists(this.Value)
    }
    get ParentPath(): IoPath {
        if (this.IsEmpty) return this
        if (this.IsRoot) return new IoPath("")
        let x = this.Value
        if (x.endsWith("\\")) x = removeLast(x, 1)
        return new IoPath(path.posix.dirname(x))
    }

    get Name(): string {
        if (this.IsRoot) return this.Value
        return path.posix.basename(this.Value)
    }
}
