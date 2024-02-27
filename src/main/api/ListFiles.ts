import * as _ from "lodash"
import { Api } from "../../shared/Api"
import { FileRelativesInfo } from "../../shared/FileRelativesInfo"
import { IFile } from "../../shared/IFile"
import { IListFilesReq } from "../../shared/IListFilesReq"
import { IListFilesRes } from "../../shared/IListFilesRes"
import { DirSizeCache, IoDir } from "../io/IoDir"
import { IoDrive } from "../io/IoDrive"
import { IoFile } from "../io/IoFile"
import { IoPath } from "../io/IoPath"
import { equalsIgnoreCase } from "../shared/equalsIgnoreCase"
import { dateToDefaultString } from "../utils/dateToDefaultString"
import { isWindows } from "../utils/isWindows"

export const ListFiles: Api["listFiles"] = async req => {
    if (!req.Path) {
        throw new Error("Path is required")
    }
    const Relatives = await GetFileRelatives(req.Path)
    const File = await GetFile({ path: req.Path })
    let Files: IFile[] | undefined

    if (File?.IsFolder) {
        Files = await GetFiles(req)
    }
    const res: IListFilesRes = { Relatives, File: File ?? undefined, Files }
    return res
}

async function GetFiles(req: IListFilesReq): Promise<IFile[]> {
    if (req.HideFiles && req.HideFolders) {
        return []
    }
    let files = await _listFiles({
        path: req.Path ?? "/",
        recursive: req.IsRecursive,
        files: !req.HideFiles,
        folders: !req.HideFolders,
    })
    files = await ApplyRequest(files, req)
    files = ApplyPaging(files, req)
    return files
}

async function GetFileRelatives(path: string): Promise<FileRelativesInfo> {
    path = normalizePath(path)
    if (!path || path === "/") return {}
    const pathInfo = new IoPath(path)
    const info: FileRelativesInfo = {}
    info.ParentFolder = (await GetFile({ path: pathInfo.ParentPath.Value })) ?? undefined
    if (!info.ParentFolder?.Path) {
        return info
    }
    const files = await _listFiles({ path: info.ParentFolder.Path, files: false, folders: true })
    const parentFiles = _.orderBy(
        files.filter(t => t.IsFolder),
        [t => t.Name]
    )
    const index = parentFiles.findIndex(t => equalsIgnoreCase(t.Name, pathInfo.Name))
    info.NextSibling = index >= 0 && index + 1 < parentFiles.length ? parentFiles[index + 1] : undefined
    info.PreviousSibling = index > 0 ? parentFiles[index - 1] : undefined
    return info
}

async function GetFile({ path }: { path: string }): Promise<IFile | null> {
    const p = normalizePath(path)
    if (!p) {
        const x: IFile = { IsFolder: true, Path: "", Name: "Home" }
        return x
    }
    const absPath = new IoPath(p).ToAbsolute()
    if (await absPath.IsFile) {
        return ToFile(await IoFile.get(absPath.Value))
    } else if ((await absPath.IsDirectory) || absPath.IsRoot) {
        return ToFile(await IoFile.get(absPath.Value))
    }
    return null
}

export interface ListFilesOptions {
    path: string
    recursive?: boolean
    files?: boolean
    folders?: boolean
}

function normalizePath(path: string | undefined): string {
    if (!path) {
        path = "/"
        return path
    }
    if (isWindows() && path.startsWith("/") && path !== "/") {
        const list = [
            // Drive letter, /C -> C:
            [/^\/([a-zA-Z])$/, "$1:/"],
            // Drive letter, /C/ggg -> C:/ggg
            [/^\/([a-zA-Z])\/(.*)$/, "$1:/$2"],
            // Network share: /mycomp -> //mycomp
            [/^\/([a-zA-Z0-9_-][a-zA-Z0-9_\-.]+)$/, "//$1"],
            // Network share: /mycomp/myshare -> //mycomp/myshare
            [/^\/([a-zA-Z0-9_-][a-zA-Z0-9_\-.]+)\/(.*)$/, "//$1/$2"],
        ] as const
        for (const regex of list) {
            const path2 = path.replace(regex[0], regex[1]) as string // TODO:
            if (path2 !== path) {
                path = path2
                break
            }
        }
    }
    return path
}

export async function _listFiles({ path, recursive, files, folders }: ListFilesOptions): Promise<IFile[]> {
    console.log(path)
    path = normalizePath(path)
    //: string, searchPattern: string, recursive: boolean, files: boolean, folders: boolean
    let isFiltered = false
    let files2: IFile[]
    if (path === "/" && isWindows()) {
        files2 = await GetHomeFiles()
    } else if (!files && !folders) {
        files2 = []
    }
    //var searchOption = recursive ? SearchOption.AllDirectories : SearchOption.TopDirectoryOnly;
    //if (searchPattern.IsNullOrEmpty())
    //    searchPattern = "*";
    else if (recursive) {
        const dir = await IoFile.get(path)
        files2 = (await IoFile.getDescendants(dir.path)).map(t => ToFile(t))
    } else {
        const dir = await IoFile.get(path)
        const children = await IoFile.getChildren(dir.path)
        if (files && !folders) {
            files2 = children.filter(t => t.isFile).map(t => ToFile(t))
        } else if (folders && !files) {
            files2 = children.filter(t => t.isDir).map(t => ToFile(t))
        } else if (folders && files) {
            files2 = children.map(t => ToFile(t))
        } else {
            throw new Error()
        }
        isFiltered = true
    }
    if (!isFiltered) {
        if (!files) {
            files2 = files2.filter(t => t.IsFolder)
        } else if (!folders) {
            files2 = files2.filter(t => !t.IsFolder)
        }
    }
    return files2
}

export async function ApplyRequest(files: IFile[], req: IListFilesReq): Promise<IFile[]> {
    if (!req.ShowHiddenFiles) {
        files = files.filter(t => !t.IsHidden)
    }
    if (req.HideFolders) {
        files = files.filter(t => !t.IsFolder)
    }
    if (req.HideFiles) {
        files = files.filter(t => t.IsFolder)
    }
    if (req.Sort != null && req.Sort.Columns != null) {
        files = _.orderBy(
            files,
            req.Sort.Columns.map(t => t.Name),
            req.Sort.Columns.map(t => (t.Descending ? "desc" : "asc"))
        )
    }
    if (req.FolderSize && !req.HideFolders) {
        files = await calculateFoldersSize(files)
    }
    return files
}

export function ToFile(file: IoFile): IFile {
    const file2: IFile = {
        type: undefined,
        Name: file.Name,
        IsFolder: !!file.isDir,
        Modified: file.LastWriteTime != null ? dateToDefaultString(file.LastWriteTime) : undefined,
        Size: file.isFile ? file.Length : undefined,
        IsHidden: file.Name?.startsWith("."),
        Extension: file?.Extension,
    }
    if (file.isDir) {
        file2.type = "folder"
    } else if (file.isFile) {
        file2.type = "file"
    } else if (file.isLink) {
        file2.type = "link"
    }
    try {
        file2.Path = file.FullName
    } catch (e) {
        console.log("ToFile error", e, file)
    }
    return file2
}

export function ApplyPaging(files: IFile[], req: IListFilesReq): IFile[] {
    if (req.skip != null) files = files.slice(req.skip)
    if (req.take != null) files = files.slice(0, req.take + 1)
    return files
}

export function quote(s: string): string {
    return `"${s}"`
}

async function GetHomeFiles(): Promise<IFile[]> {
    const list = await IoDrive.getDrives()
    return list.map(t => /*new File*/ ({
        IsFolder: true,
        Name: t.Name,
        Path: t.Name,
        Size: t.IsReady ? parseInt(t.AvailableFreeSpace as string) : undefined,
    }))
}

let dirSizeCacheTime: number | undefined
let dirSizeCache: DirSizeCache | undefined
function getDirSizeCache() {
    const tenMinutes = 10 * 60 * 1000
    if (dirSizeCache && dirSizeCacheTime && Date.now() - dirSizeCacheTime < tenMinutes) {
        return dirSizeCache
    }
    dirSizeCache = {}
    dirSizeCacheTime = Date.now()
    return dirSizeCache
}
async function calculateFoldersSize(folders: IFile[]): Promise<IFile[]> {
    const cache = getDirSizeCache()
    const list: IFile[] = []
    for (const file of folders) {
        try {
            //console.log("CalculateFoldersSize", file);
            if (file.IsFolder && file.Path) {
                file.Size = await IoDir.getSize(file.Path, cache)
            }
        } catch (e) {
            console.log("calculateFoldersSize error", e)
        }
        list.push(file)
    }
    return list
}
