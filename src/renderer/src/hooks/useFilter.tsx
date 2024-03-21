import { useMemo } from "react"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"

export function useFilter({
    req,
    list,
    getFolderSelection,
}: {
    req: IListFilesReq
    list: IFile[]
    getFolderSelection: (key: string) => string | null
}) {
    //
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = getFolderSelection(t.name)
            return !md // && !md?.watched
        })
    }, [getFolderSelection, list, req.hideWatched])
}
