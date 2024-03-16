import { css } from "@emotion/css"
import React, { useCallback } from "react"
import { Column } from "../../../shared/Column"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
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
import { Dropdown } from "./Dropdown"
import { MenuButton, ToggleMenuButton } from "./MenuButton"
import { IListFilesRes } from "../../../shared/IListFilesRes"

export function MainMenu({
    req,
    selectedFile,
    dispatcher,
    sorting,
    res,
}: {
    req: IListFilesReq
    res: IListFilesRes
    selectedFile?: IFile
    dispatcher: Dispatcher
    sorting: SortConfig
}) {
    const Delete = useCallback(
        (e?: React.KeyboardEvent) =>
            selectedFile && dispatcher.deleteOrTrash({ file: selectedFile, isShiftDown: e?.shiftKey ?? false }),

        [dispatcher, selectedFile]
    )

    const contextFile = selectedFile ?? res.file ?? null
    const { goto, google, subs, exploreFile, OrderByInnerSelection, updateReq } = dispatcher
    return (
        <div className={MenuDiv}>
            <div className={ButtonsDiv}>
                <div className={ButtonGroup}>
                    <MenuButton icon={<UpIcon />} action={goto.up}>
                        Up
                    </MenuButton>
                    <MenuButton icon={<PrevIcon />} action={goto.prev}>
                        Prev
                    </MenuButton>
                    <MenuButton icon={<NextIcon />} action={goto.next}>
                        Next
                    </MenuButton>
                </div>
                <div className={ButtonGroup}>
                    <ToggleMenuButton
                        icon={<FolderIcon />}
                        action={() => updateReq({ folderSize: !req.folderSize })}
                        isActive={!!req.folderSize}
                    >
                        Folder
                    </ToggleMenuButton>
                    <MenuButton icon={<GoogleIcon />} action={google}></MenuButton>
                    <MenuButton icon={<SubtitleIcon />} action={subs}></MenuButton>
                    <MenuButton
                        icon={<ExploreIcon />}
                        action={() => contextFile && exploreFile(contextFile)}
                        disabled={!contextFile}
                    >
                        Explore
                    </MenuButton>
                    <ToggleMenuButton
                        icon={<NewIcon />}
                        action={() => updateReq({ hideWatched: !req.hideWatched })}
                        isActive={!!req.hideWatched}
                    >
                        New
                    </ToggleMenuButton>
                </div>
                <div className={ButtonGroup}>
                    <MenuButton icon={<TrashIcon />} action={Delete}></MenuButton>
                    <Dropdown
                        toggler={<MenuButton icon={<SortIcon />}></MenuButton>}
                        popup={
                            <div className="menu">
                                <ToggleMenuButton
                                    action={OrderByInnerSelection}
                                    isActive={dispatcher.isSortedBy(sorting, Column.hasInnerSelection)}
                                >
                                    Watched
                                </ToggleMenuButton>
                                <ToggleMenuButton
                                    action={() => updateReq({ foldersFirst: !req.foldersFirst })}
                                    isActive={!!req.foldersFirst}
                                >
                                    Folders first
                                </ToggleMenuButton>
                            </div>
                        }
                    />
                    <Dropdown
                        toggler={<MenuButton icon={<MoreIcon />}>More</MenuButton>}
                        popup={
                            <div className="menu">
                                <ToggleMenuButton
                                    action={() => updateReq({ hideFolders: !req.hideFolders })}
                                    isActive={!!req.hideFolders}
                                >
                                    Hide Folders
                                </ToggleMenuButton>
                                <ToggleMenuButton
                                    action={() => updateReq({ hideFiles: !req.hideFiles })}
                                    isActive={!!req.hideFiles}
                                >
                                    Hide Files
                                </ToggleMenuButton>
                                <ToggleMenuButton
                                    action={() => updateReq({ recursive: !req.recursive })}
                                    isActive={!!req.recursive}
                                >
                                    Recursive
                                </ToggleMenuButton>
                                <ToggleMenuButton
                                    action={() => updateReq({ keepView: !req.keepView })}
                                    isActive={!!req.keepView}
                                >
                                    Keep
                                </ToggleMenuButton>
                                <ToggleMenuButton
                                    action={() => updateReq({ hidden: !req.hidden })}
                                    isActive={!!req.hidden}
                                >
                                    Hidden
                                </ToggleMenuButton>
                                <ToggleMenuButton action={() => updateReq({ vlc: !req.vlc })} isActive={!!req.vlc}>
                                    VLC
                                </ToggleMenuButton>
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
