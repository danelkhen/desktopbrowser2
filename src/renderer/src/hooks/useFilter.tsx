import { Dispatch, SetStateAction, useMemo } from "react"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { useDispatcher } from "../services/Dispatcher"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { FolderSelections } from "../../../shared/Api"

export function useFilter(
    req: IListFilesReq,
    list: IFile[],
    res: IListFilesRes,
    setRes: Dispatch<SetStateAction<IListFilesRes>>,
    folderSelections: FolderSelections,
    setFolderSelections: Dispatch<SetStateAction<FolderSelections>>
) {
    const { getFolderSelection } = useDispatcher(req, res, setRes, folderSelections, setFolderSelections)
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = getFolderSelection(t.name)
            return !md // && !md?.watched
        })
    }, [getFolderSelection, list, req.hideWatched])
}
