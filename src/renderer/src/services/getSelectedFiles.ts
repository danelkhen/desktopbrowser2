import { IListFilesRes } from "../../../shared/IListFilesRes"

export function getSelectedFiles(res: IListFilesRes) {
    const fm = res.file?.name ? res.selections?.[res.file?.name] : null
    const selectedFileName = fm ?? null
    const file = res?.files?.find(t => t.name === selectedFileName)
    return file ? [file] : []
}
