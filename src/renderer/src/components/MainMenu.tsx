import { cx } from "@emotion/css"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined"
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined"
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined"
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
import { ListItemIcon, ListItemText, MenuItem, MenuList, Pagination, useMediaQuery, useTheme } from "@mui/material"
import React from "react"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { ISorting } from "../../../shared/ISorting"
import SortIcon from "../assets/icons/sort.svg?react"
import SubtitleIcon from "../assets/icons/subtitle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import { scrollToSelection } from "../hooks/useSelection"
import { getGoogleSearchLink } from "../lib/getGoogleSearchLink"
import { getSubtitleSearchLink } from "../lib/getSubtitleSearchLink"
import { api } from "../services/api"
import { c } from "../services/c"
import { AppLinkBehavior } from "./AppLink"
import { Clock } from "./Clock"
import { GetNavUrl } from "./GetNavUrl"
import { MenuListGroup } from "./MenuListGroup"
import { useVlcStatus } from "./useVlcStatus"

export function MainMenu({
    req,
    selectedFile,
    res,
    pageIndex,
    totalPages,
    setPageIndex,
    reloadFiles,
    isSortedBy,
    getNavUrl,
    getSortBy,
}: {
    req: IListFilesReq
    res: IListFilesRes
    selectedFile?: IFile
    totalPages: number | null
    pageIndex: number
    setPageIndex: (v: number) => void
    reloadFiles: () => unknown
    isSortedBy: (key: string, desc?: boolean | undefined) => boolean
    getSortBy: (column: string) => ISorting
    getNavUrl: GetNavUrl
}) {
    const theme = useTheme()
    const lg = useMediaQuery(theme.breakpoints.up("lg"))
    const group = !lg

    const deleteAndRefresh = async (file: IFile) => {
        if (!file.path) return
        const fileOrFolder = file.isFolder ? "folder" : "file"
        if (!window.confirm("Are you sure you wan to delete the " + fileOrFolder + "?\n" + file.path)) return
        await api.del({ path: file.path })
        await reloadFiles()
    }

    const trashAndRefresh = async (file: IFile) => {
        if (!file.path) return
        await api.trash({ path: file.path })
        await reloadFiles()
    }

    const deleteOrTrash = async ({ file, isShiftDown }: { file: IFile; isShiftDown: boolean }) => {
        if (isShiftDown) {
            await deleteAndRefresh(file)
            return
        }
        await trashAndRefresh(file)
    }

    const Delete = (e?: React.KeyboardEvent) =>
        selectedFile && deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false })

    const contextFile = selectedFile ?? res.file ?? null

    console.log("MainMenu")
    const vlcStatus = useVlcStatus()
    const progressPct = Math.round((vlcStatus?.position ?? 0) * 100) + "%"

    // console.log(vlcStatus)
    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    // const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null)

    return (
        <div className={cx("flex gap-1.5 p-1.5 pb-0 text-xs", style)}>
            <MenuList>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, path: res.parent?.path ?? "/" }))}
                    disabled={req.path === "/"}
                >
                    <ListItemIcon>
                        <ArrowUpwardOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Up</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, path: res.prev?.path }))}
                    disabled={!res.prev?.path}
                >
                    <ListItemIcon>
                        <ArrowBackOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Prev</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, path: res.next?.path }))}
                    disabled={!res.next?.path}
                >
                    <ListItemIcon>
                        <ArrowForwardOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Next</ListItemText>
                </MenuItem>
                <MenuItem onClick={reloadFiles}>
                    <ListItemIcon>
                        <RefreshOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Refresh</ListItemText>
                </MenuItem>
            </MenuList>
            <MenuListGroup group={group} header={"More"} className={style}>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, folderSize: !req.folderSize }))}
                    selected={!!req.folderSize}
                >
                    <ListItemIcon>
                        <FolderOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Folder</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={res?.file ? getGoogleSearchLink(res?.file) : ""}
                    target="_blank"
                >
                    <ListItemIcon>
                        <SearchOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Google</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={res?.file ? getSubtitleSearchLink(res?.file) : ""}
                    target="_blank"
                >
                    <ListItemIcon>
                        <SubtitleIcon />
                    </ListItemIcon>
                    <ListItemText>Subs</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => contextFile?.path && api.explore({ path: contextFile.path })}
                    disabled={!contextFile}
                >
                    <ListItemIcon>
                        <ExploreOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Explore</ListItemText>
                </MenuItem>
                <MenuItem disabled={!selectedFile} onClick={() => scrollToSelection()}>
                    <ListItemIcon>
                        <QueuePlayNextOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Selection</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => Delete()}>
                    <ListItemIcon>
                        <TrashIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </MenuListGroup>
            <MenuListGroup
                group
                header={
                    <>
                        <ListItemIcon>
                            <SortIcon />
                        </ListItemIcon>
                        <ListItemText>Sort</ListItemText>
                    </>
                }
                className={style}
            >
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, sort: getSortBy(Column.hasInnerSelection) }))}
                    selected={isSortedBy(Column.hasInnerSelection)}
                >
                    Watched
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, foldersFirst: !req.foldersFirst }))}
                    selected={!!req.foldersFirst}
                >
                    Folders first
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, sort: getSortBy(Column.name) }))}
                    selected={isSortedBy(Column.name)}
                >
                    Name
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, foldersFirst: undefined, sort: undefined }))}
                    disabled={!req.foldersFirst && !req.sort}
                >
                    Clear sorting
                </MenuItem>
            </MenuListGroup>
            <MenuListGroup
                group
                header={
                    <>
                        <ListItemIcon>
                            <MoreHorizOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText>More</ListItemText>
                    </>
                }
                className={style}
            >
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, hideWatched: !req.hideWatched }))}
                    selected={!!req.hideWatched}
                >
                    <ListItemText>Unwatched</ListItemText>
                </MenuItem>

                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, hideFolders: !req.hideFolders }))}
                    selected={!!req.hideFolders}
                >
                    Hide folders
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, hideFiles: !req.hideFiles }))}
                    selected={!!req.hideFiles}
                >
                    Hide files
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, recursive: !req.recursive }))}
                    selected={!!req.recursive}
                >
                    Recursive
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, keepView: !req.keepView }))}
                    selected={!!req.keepView}
                >
                    Keep view
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, hidden: !req.hidden }))}
                    selected={!!req.hidden}
                >
                    Hidden
                </MenuItem>
            </MenuListGroup>
            {!req.vlc ? (
                <MenuList>
                    <MenuItem
                        component={AppLinkBehavior}
                        href={getNavUrl(t => ({ ...t, vlc: !req.vlc }))}
                        selected={!!req.vlc}
                    >
                        VLC
                    </MenuItem>
                </MenuList>
            ) : (
                <MenuListGroup
                    group
                    renderHeader={props => (
                        <MenuItem
                            {...props}
                            style={{ "--tw-gradient-to-position": progressPct }}
                            className="bg-purple-700 text-white max-w-20 truncate bg-gradient-to-r from-purple-500 to-0%"
                        >
                            {vlcStatus.path ? getPathPosixBaseName(vlcStatus.path) : "VLC"}
                        </MenuItem>
                    )}
                >
                    <MenuItem
                        component={AppLinkBehavior}
                        href={
                            vlcStatus.path ? getNavUrl(t => ({ ...t, path: getPathPosixDirName(vlcStatus.path!) })) : ""
                        }
                        disabled={!vlcStatus.path}
                        // style={progressStyle({ position: vlcStatus.position, start: "10px" })}
                        className={c.progress}
                    >
                        Open folder
                    </MenuItem>
                    <MenuItem
                        component={AppLinkBehavior}
                        href={getNavUrl(t => ({ ...t, vlc: !req.vlc }))}
                        selected={!!req.vlc}
                    >
                        Disable
                    </MenuItem>
                </MenuListGroup>
            )}
            <Pagination count={totalPages || 1} onChange={(e, v) => setPageIndex(v - 1)} page={pageIndex + 1} />
            <MenuList>
                <MenuItem>
                    <Clock />
                </MenuItem>
            </MenuList>
        </div>
    )
}

const style = "MainMenu"

function getPathPosixBaseName(path: string) {
    return path.split("/").pop()
}

function getPathPosixDirName(path: string) {
    const x = path.split("/")
    x.pop()
    return x.join("/")
}
