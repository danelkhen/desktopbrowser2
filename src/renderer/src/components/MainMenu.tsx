import { css } from "@emotion/css"
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined"
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined"
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined"
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined"
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined"
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined"
import QueuePlayNextOutlinedIcon from "@mui/icons-material/QueuePlayNextOutlined"
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined"
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
import { colors } from "../GlobalStyle"
import SortIcon from "../assets/icons/sort.svg?react"
import SubtitleIcon from "../assets/icons/subtitle.svg?react"
import TrashIcon from "../assets/icons/trash.svg?react"
import { scrollToSelection } from "../hooks/useSelection"
import { getGoogleSearchLink } from "../lib/getGoogleSearchLink"
import { getSubtitleSearchLink } from "../lib/getSubtitleSearchLink"
import { api } from "../services/api"
import { AppLinkBehavior } from "./AppLink"
import { Clock } from "./Clock"
import { GetNavUrl } from "./GetNavUrl"

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
            <MenuList>
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
                <MenuItem
                    component={AppLinkBehavior}
                    href={getNavUrl(t => ({ ...t, hideWatched: !req.hideWatched }))}
                    selected={!!req.hideWatched}
                >
                    <ListItemIcon>
                        <QueuePlayNextOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Unwatched</ListItemText>
                </MenuItem>
                <MenuItem disabled={!selectedFile} onClick={() => scrollToSelection()}>
                    <ListItemIcon>
                        <QueuePlayNextOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>Selection</ListItemText>
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
                </Menu>
                <MenuItem onClick={e => setAnchorEl2(e.currentTarget)}>
                    <ListItemIcon>
                        <MoreHorizOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText>More</ListItemText>
                </MenuItem>
                <Menu anchorEl={anchorEl2} open={!!anchorEl2} onClose={() => setAnchorEl2(null)} className={style}>
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
        > ul {
            flex-wrap: nowrap;
        }
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
            color: white;
            background-color: #a276f8;
            &:hover {
                background-color: #a97eff;
            }
        }

        .${listItemTextClasses.primary} {
            font-size: inherit;
            color: inherit;
        }
        svg {
            font-size: 1.5em;
        }
    }
`
