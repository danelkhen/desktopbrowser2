import { useMemo } from "react"
import { IFile } from "../../../shared/IFile"

export function useSearch(search: string, list: IFile[]) {
    return useMemo(() => {
        if (!search) return list
        const s = search.toLowerCase()
        return list.filter(t => t.Name.toLowerCase().includes(s))
    }, [search, list])
}
