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
import React, { Dispatch, SetStateAction, useCallback } from "react"
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
import { useDispatcher } from "../services/Dispatcher"
import { Clock } from "./Clock"
import { FolderSelections } from "../../../shared/Api"
import { GridColumns } from "./Grid"

export function MainMenu({
    req,
    selectedFile,
    sorting,
    res,
    pageIndex,
    totalPages,
    setPageIndex,
    setRes,
    folderSelections,
    setFolderSelections,
    gridColumns,
}: {
    req: IListFilesReq
    res: IListFilesRes
    selectedFile?: IFile
    sorting: SortConfig
    totalPages: number | null
    pageIndex: number
    setPageIndex: (v: number) => void
    setRes: Dispatch<SetStateAction<IListFilesRes>>
    folderSelections: FolderSelections
    setFolderSelections: Dispatch<SetStateAction<FolderSelections>>
    gridColumns: GridColumns<IFile>
}) {
    const {
        deleteOrTrash,
        canUp,
        canPrev,
        canNext,
        up,
        prev,
        next,
        google,
        subs,
        exploreFile,
        isSortedBy,
        navToReq,
        orderBy,
    } = useDispatcher({ req, res, setRes, folderSelections, setFolderSelections })

    const Delete = useCallback(
        (e?: React.KeyboardEvent) =>
            selectedFile && deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

        [deleteOrTrash, selectedFile]
    )

    const contextFile = selectedFile ?? res.file ?? null

    // const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [anchorEl2, setAnchorEl2] = React.useState<null | HTMLElement>(null)
    function updateReq(x: Partial<IListFilesReq>) {
        navToReq(t => ({ ...t, ...x }))
    }

    const orderByInnerSelection = () => orderBy(Column.hasInnerSelection, gridColumns)
    return (
        <div className={style}>
            <MenuList>
                <MenuItem onClick={up} disabled={!canUp}>
                    <ListItemIcon>
                        <UpIcon />
                    </ListItemIcon>
                    <ListItemText>Up</ListItemText>
                </MenuItem>
                <MenuItem onClick={prev} disabled={!canPrev}>
                    <ListItemIcon>
                        <PrevIcon />
                    </ListItemIcon>
                    <ListItemText>Prev</ListItemText>
                </MenuItem>
                <MenuItem onClick={next} disabled={!canNext}>
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
                    <MenuItem onClick={orderByInnerSelection} selected={isSortedBy(sorting, Column.hasInnerSelection)}>
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
    flex-wrap: wrap;
    .${paginationClasses.root} {
        display: flex;
        flex: 1;
        justify-content: center;
    }
    > .${listClasses.root} {
        display: flex;
        padding: 0;
        .${menuItemClasses.root} {
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
            .${listItemIconClasses.root} {
                min-width: 0;
                padding-right: 10px;
            }
        }
    }
    .${menuItemClasses.root} {
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

        .${listItemTextClasses.primary} {
            font-size: inherit;
        }
    }
`
