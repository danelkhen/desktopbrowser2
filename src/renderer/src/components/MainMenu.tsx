import { css } from "@emotion/css"
import {
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Pagination,
    listClasses,
    listItemIconClasses,
    listItemTextClasses,
    menuItemClasses,
    paginationClasses,
} from "@mui/material"
import React from "react"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { SortConfig } from "../../../shared/SortConfig"
import ExploreIcon from "../assets/icons/explore.svg?react"
import FolderIcon from "../assets/icons/folder.svg?react"
import GoogleIcon from "../assets/icons/google.svg?react"
import MoreIcon from "../assets/icons/more.svg?react"
import NewIcon from "../assets/icons/new.svg?react"
import NextIcon from "../assets/icons/next.svg?react"
import PrevIcon from "../assets/icons/prev.svg?react"
import SortIcon from "../assets/icons/sort.svg?react"
import SubtitleIcon from "../assets/icons/subtitle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import UpIcon from "../assets/icons/up.svg?react"
import { getGoogleSearchLink } from "../lib/getGoogleSearchLink"
import { getSubtitleSearchLink } from "../lib/getSubtitleSearchLink"
import { api } from "../services/api"
import { AppLinkBehavior } from "./AppLink"
import { Clock } from "./Clock"
import { GetNavUrl } from "./GetNavUrl"
import { colors } from "../GlobalStyle"

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
    reloadFiles: () => Promise<void>
    isSortedBy: (key: string, desc?: boolean | undefined) => boolean
    getSortBy: (column: string) => SortConfig
    getNavUrl: GetNavUrl
}) {
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

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null)

    return (
        <div className={style}>
            <MenuList>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, path: res.parent?.path ?? "/" }))}
                    disabled={req.path === "/"}
                >
                    <ListItemIcon>
                        <UpIcon />
                    </ListItemIcon>
                    <ListItemText>Up</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, path: res.prev?.path }))}
                    disabled={!res.prev?.path}
                >
                    <ListItemIcon>
                        <PrevIcon />
                    </ListItemIcon>
                    <ListItemText>Prev</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, path: res.next?.path }))}
                    disabled={!res.next?.path}
                >
                    <ListItemIcon>
                        <NextIcon />
                    </ListItemIcon>
                    <ListItemText>Next</ListItemText>
                </MenuItem>
            </MenuList>
            <MenuList>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, folderSize: !req.folderSize }))}
                    selected={!!req.folderSize}
                >
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText>Folder</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={res?.file ? getGoogleSearchLink(res?.file) : ""}
                    target="_blank"
                >
                    <ListItemIcon>
                        <GoogleIcon />
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
                        <ExploreIcon />
                    </ListItemIcon>
                    <ListItemText>Explore</ListItemText>
                </MenuItem>
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, hideWatched: !req.hideWatched }))}
                    selected={!!req.hideWatched}
                >
                    <ListItemIcon>
                        <NewIcon />
                    </ListItemIcon>
                    <ListItemText>Unwatched</ListItemText>
                </MenuItem>
            </MenuList>
            <MenuList>
                <MenuItem onClick={() => Delete()}>
                    <ListItemIcon>
                        <TrashIcon />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                <MenuItem onClick={e => setAnchorEl(e.currentTarget)}>
                    <ListItemIcon>
                        <SortIcon />
                    </ListItemIcon>
                    <ListItemText>Sort</ListItemText>
                </MenuItem>
                <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} className={style}>
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
                </Menu>
                <MenuItem onClick={e => setAnchorEl2(e.currentTarget)}>
                    <ListItemIcon>
                        <MoreIcon />
                    </ListItemIcon>
                    <ListItemText>More</ListItemText>
                </MenuItem>
                <Menu anchorEl={anchorEl2} open={!!anchorEl2} onClose={() => setAnchorEl2(null)} className={style}>
                    <MenuItem
                        component={AppLinkBehavior}
                        href={getNavUrl(t => ({ ...t, hideFolders: !req.hideFolders }))}
                        selected={!!req.hideFolders}
                    >
                        Hide Folders
                    </MenuItem>
                    <MenuItem
                        component={AppLinkBehavior}
                        href={getNavUrl(t => ({ ...t, hideFiles: !req.hideFiles }))}
                        selected={!!req.hideFiles}
                    >
                        Hide Files
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
                        Keep
                    </MenuItem>
                    <MenuItem
                        component={AppLinkBehavior}
                        href={getNavUrl(t => ({ ...t, hidden: !req.hidden }))}
                        selected={!!req.hidden}
                    >
                        Hidden
                    </MenuItem>
                    <MenuItem
                        component={AppLinkBehavior}
                        href={getNavUrl(t => ({ ...t, vlc: !req.vlc }))}
                        selected={!!req.vlc}
                    >
                        VLC
                    </MenuItem>
                </Menu>
            </MenuList>
            <Pagination count={totalPages || 1} onChange={(e, v) => setPageIndex(v - 1)} page={pageIndex + 1} />
            <MenuList>
                <MenuItem>
                    <Clock />
                </MenuItem>
            </MenuList>
        </div>
    )
}

const style = css`
    label: MainMenu;
    display: flex;
    gap: 6px;
    padding: 6px 6px 0 6px;
    font-size: 10px;
    flex-wrap: wrap;
    .${paginationClasses.root} {
        display: flex;
        flex: 1;
        justify-content: flex-end;
    }
    > .${listClasses.root} {
        display: flex;
        padding: 0;
        .${menuItemClasses.root} {
            border: 1px solid #282828;
            margin-left: -1px;
            /* padding: 0; */
            &:first-child {
                border-radius: 25px 0 0 25px;
                padding-left: 20px;
                margin-left: 0;
            }
            &:last-child {
                border-radius: 0 25px 25px 0;
                padding-right: 20px;
            }
            &:first-child:last-child {
                border-radius: 25px;
            }
            .${listItemIconClasses.root} {
                min-width: 0;
                padding-right: 10px;
            }
        }
    }
    .${menuItemClasses.root} {
        font-size: inherit;
        line-height: 1.75;
        color: ${colors.fg3};
        &:hover {
            /* background-color: #864aff; */
        }
        &.Mui-selected {
            background-color: #a276f8;
            &:hover {
                background-color: #864aff;
            }
        }

        .${listItemTextClasses.primary} {
            font-size: inherit;
            color: inherit;
        }
    }
`
