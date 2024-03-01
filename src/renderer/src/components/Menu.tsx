import { css } from "@emotion/css"
import React, { useCallback } from "react"
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
import { Dispatcher } from "../services/Dispatcher"
import { Dropdown } from "./Dropdown"
import { MenuButton, ToggleMenuButton } from "./MenuButton"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IFile } from "../../../shared/IFile"
import { Column } from "../../../shared/Column"
import { SortConfig } from "../hooks/useSorting"

export function Menu({
    req,
    selectedFile,
    dispatcher,
    sorting,
}: {
    req: IListFilesReq
    selectedFile?: IFile
    dispatcher: Dispatcher
    sorting: SortConfig
}) {
    const Delete = useCallback(
        (e?: React.KeyboardEvent) =>
            selectedFile && dispatcher.deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

        [dispatcher, selectedFile]
    )

    const { goto, google, subs, explore, OrderByInnerSelection, disableSorting, isSortingDisabled } = dispatcher
    return (
        <div className={MenuDiv}>
            <div className={ButtonsDiv}>
                <div className={ButtonGroup}>
                    <MenuButton icon={<UpIcon />} action={goto.up} label="Up" />
                    <MenuButton icon={<PrevIcon />} action={goto.prev} label="Prev" />
                    <MenuButton icon={<NextIcon />} action={goto.next} label="Next" />
                </div>
                <div className={ButtonGroup}>
                    <ToggleMenuButton
                        icon={<FolderIcon />}
                        action={() => dispatcher.updateReq({ folderSize: !req.folderSize })}
                        isActive={!!req.folderSize}
                        label="Folder"
                    />
                    <MenuButton icon={<GoogleIcon />} action={google} label="Google" />
                    <MenuButton icon={<SubtitleIcon />} action={subs} label="Subs" />
                    <MenuButton icon={<ExploreIcon />} action={explore} label="Explore" />
                    <ToggleMenuButton
                        icon={<NewIcon />}
                        action={() => dispatcher.updateReq({ hideWatched: !req.hideWatched })}
                        isActive={!!req.hideWatched}
                        label="New"
                    />
                </div>
                <div className={ButtonGroup}>
                    <MenuButton icon={<TrashIcon />} action={Delete} label="Delete" />
                    <Dropdown
                        toggler={<MenuButton icon={<SortIcon />} label="Sort" />}
                        popup={
                            <div className="menu">
                                <ToggleMenuButton
                                    action={OrderByInnerSelection}
                                    isActive={dispatcher.isSortedBy(sorting, Column.hasInnerSelection)}
                                    label="Watched"
                                />
                                <ToggleMenuButton
                                    action={() => dispatcher.updateReq({ foldersFirst: !req.foldersFirst })}
                                    isActive={!!req.foldersFirst}
                                    label="Folders first"
                                />
                                <ToggleMenuButton
                                    action={disableSorting}
                                    isActive={isSortingDisabled()}
                                    label="Disable sort"
                                />
                            </div>
                        }
                    />
                    <Dropdown
                        toggler={<MenuButton icon={<MoreIcon />} label="More" />}
                        popup={
                            <div className="menu">
                                <ToggleMenuButton
                                    action={() => dispatcher.updateReq({ hideFolders: !req.hideFolders })}
                                    isActive={!!req.hideFolders}
                                    label="Hide Folders"
                                />
                                <ToggleMenuButton
                                    action={() => dispatcher.updateReq({ hideFiles: !req.hideFiles })}
                                    isActive={!!req.hideFiles}
                                    label="Hide Files"
                                />
                                <ToggleMenuButton
                                    action={() => dispatcher.updateReq({ recursive: !req.recursive })}
                                    isActive={!!req.recursive}
                                    label="Recursive"
                                />
                                <ToggleMenuButton
                                    action={() => dispatcher.updateReq({ keepView: !req.keepView })}
                                    isActive={!!req.keepView}
                                    label="Keep"
                                />
                                <ToggleMenuButton
                                    action={() => dispatcher.updateReq({ hidden: !req.hidden })}
                                    isActive={!!req.hidden}
                                    label="Hidden"
                                />
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    )
}

const ButtonGroup = css`
    display: flex;
    flex-direction: row;
    background-color: #0c0c0c;
    text-align: center;
    margin-right: 1em;
    border-radius: 20px;
    > button:first-child {
        border-left: none;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }
    > button:last-child {
        border-right: none;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
    }
`
const MenuDiv = css`
    display: flex;
    flex: 1;
    padding: 0.5em;
    border-bottom: 1px solid #282828;
    margin-right: 0;
    max-width: 100%;
`
const ButtonsDiv = css`
    display: flex;
    flex: 1;
    flex-direction: row;
`
