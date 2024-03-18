import { css } from "@emotion/css"
import { ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Pagination } from "@mui/material"
import React, { useCallback } from "react"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
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
import { SortConfig } from "../hooks/useSorting"
import { Dispatcher } from "../services/Dispatcher"
import { Clock } from "./Clock"

export function MainMenu({
    req,
    selectedFile,
    dispatcher,
    sorting,
    res,
    pageIndex,
    totalPages,
    setPageIndex,
}: {
    req: IListFilesReq
    res: IListFilesRes
    selectedFile?: IFile
    dispatcher: Dispatcher
    sorting: SortConfig
    totalPages: number | null
    pageIndex: number
    setPageIndex: (v: number) => void
}) {
    const Delete = useCallback(
        (e?: React.KeyboardEvent) =>
            selectedFile && dispatcher.deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

        [dispatcher, selectedFile]
    )

    const contextFile = selectedFile ?? res.file ?? null
    const { goto, google, subs, exploreFile, OrderByInnerSelection, updateReq } = dispatcher
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null)
    return (
        <div className={style}>
            <MenuList>
                <MenuItem onClick={goto.up}>
                    <ListItemIcon>
                        <UpIcon />
                    </ListItemIcon>
                    <ListItemText>Up</ListItemText>
                </MenuItem>
                <MenuItem onClick={goto.prev}>
                    <ListItemIcon>
                        <PrevIcon />
                    </ListItemIcon>
                    <ListItemText>Prev</ListItemText>
                </MenuItem>
                <MenuItem onClick={goto.next}>
                    <ListItemIcon>
                        <NextIcon />
                    </ListItemIcon>
                    <ListItemText>Next</ListItemText>
                </MenuItem>
            </MenuList>
            <MenuList>
                <MenuItem onClick={() => updateReq({ folderSize: !req.folderSize })} selected={!!req.folderSize}>
                    <ListItemIcon>
                        <FolderIcon />
                    </ListItemIcon>
                    <ListItemText>Folder</ListItemText>
                </MenuItem>
                <MenuItem onClick={google}>
                    <ListItemIcon>
                        <GoogleIcon />
                    </ListItemIcon>
                    <ListItemText>Google</ListItemText>
                </MenuItem>
                <MenuItem onClick={subs}>
                    <ListItemIcon>
                        <SubtitleIcon />
                    </ListItemIcon>
                    <ListItemText>Subs</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => contextFile && exploreFile(contextFile)} disabled={!contextFile}>
                    <ListItemIcon>
                        <ExploreIcon />
                    </ListItemIcon>
                    <ListItemText>Explore</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => updateReq({ hideWatched: !req.hideWatched })} selected={!!req.hideWatched}>
                    <ListItemIcon>
                        <NewIcon />
                    </ListItemIcon>
                    <ListItemText>New</ListItemText>
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
                        onClick={OrderByInnerSelection}
                        selected={dispatcher.isSortedBy(sorting, Column.hasInnerSelection)}
                    >
                        Watched
                    </MenuItem>
                    <MenuItem
                        onClick={() => updateReq({ foldersFirst: !req.foldersFirst })}
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
                    <MenuItem onClick={() => updateReq({ hideFolders: !req.hideFolders })} selected={!!req.hideFolders}>
                        Hide Folders
                    </MenuItem>
                    <MenuItem onClick={() => updateReq({ hideFiles: !req.hideFiles })} selected={!!req.hideFiles}>
                        Hide Files
                    </MenuItem>
                    <MenuItem onClick={() => updateReq({ recursive: !req.recursive })} selected={!!req.recursive}>
                        Recursive
                    </MenuItem>
                    <MenuItem onClick={() => updateReq({ keepView: !req.keepView })} selected={!!req.keepView}>
                        Keep
                    </MenuItem>
                    <MenuItem onClick={() => updateReq({ hidden: !req.hidden })} selected={!!req.hidden}>
                        Hidden
                    </MenuItem>
                    <MenuItem onClick={() => updateReq({ vlc: !req.vlc })} selected={!!req.vlc}>
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
    gap: 10px;
    padding: 10px 10px 0 10px;
    font-size: 14px;
    .MuiPagination-root {
        display: flex;
        flex: 1;
        justify-content: center;
    }
    > .MuiList-root {
        display: flex;
        padding: 0;
        .MuiMenuItem-root {
            border: 1px solid #282828;
            margin-left: -1px;
            &:first-of-type {
                border-radius: 25px 0 0 25px;
                padding-left: 28px;
                margin-left: 0;
            }
            &:last-of-type {
                border-radius: 0 25px 25px 0;
                padding-right: 28px;
            }
            &:first-of-type:last-of-type {
                border-radius: 25px;
            }
            .MuiListItemIcon-root {
                min-width: 0;
                padding-right: 10px;
            }
        }
    }
    .MuiMenuItem-root {
        font-size: inherit;
        line-height: 2;
        &:hover {
            /* background-color: #864aff; */
        }
        &.Mui-selected {
            background-color: #a276f8;
            &:hover {
                background-color: #864aff;
            }
        }

        .MuiListItemText-primary {
            font-size: inherit;
        }
    }
`
