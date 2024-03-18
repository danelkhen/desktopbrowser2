import { useMemo } from "react"
import { dispatcher } from "../services/Dispatcher"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"

export function useFilter(req: IListFilesReq, list: IFile[]) {
    return useMemo(() => {
        if (!req.hideWatched) return list
        return list.filter(t => {
            const md = dispatcher.getFileMeta(t.name)
            return !md?.watched && !md?.selectedFiles?.length
        })
    }, [req.hideWatched, list])
}
