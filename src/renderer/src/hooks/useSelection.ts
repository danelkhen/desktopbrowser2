import { useCallback, useEffect, useMemo, useState } from "react"
import { IFile } from "../../../shared/IFile"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { Selection } from "../lib/Selection"
import { api } from "../services/api"
import { c } from "../services/c"
import { getSelectedFiles } from "../services/getSelectedFiles"
import { calcItemsOnScreen } from "./calcItemsOnScreen"

export function useSelection({ res }: { readonly res: IListFilesRes }) {
    const [_selectedFiles, _setSelectedFiles] = useState<IFile[] | null>(null)
    useEffect(() => {
        if (!res) return
        _setSelectedFiles(null)
    }, [res])
    const initialSelectedFiles = useMemo(() => getSelectedFiles(res), [res])
    const selectedFiles = _selectedFiles ?? initialSelectedFiles
    const selectedFile = selectedFiles[selectedFiles.length - 1]

    const setSelectedFiles = useCallback(
        async (selectedFiles: IFile[]) => {
            if (!res?.file?.name) {
                return
            }
            const selectedFile = selectedFiles[selectedFiles.length - 1]
            console.log("saveSelectionAndSetSelectedItems", res.file.name, selectedFile?.name)
            _setSelectedFiles(Array.from(selectedFiles))
            void setFolderSelection(res.file.name, selectedFile?.name ?? null)
        },
        [res.file?.name]
    )

    // Keyboard selection
    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            const itemsOnScreen = calcItemsOnScreen(document.querySelector(`.${c.fileRow}`))
            const selection = new Selection<IFile>({
                all: res?.files ?? [],
                selected: new Set(selectedFiles),
                itemsOnScreen,
            })
            const target = e.target as HTMLElement
            if (target.matches("input:not(#tbQuickFind),select")) return
            ;(document.querySelector("#tbQuickFind") as HTMLElement).focus()
            const newSelection = selection.keyDown(e)
            if (newSelection === selection) return
            void setSelectedFiles(Array.from(newSelection.selected))
        }
        window.addEventListener("keydown", Win_keydown)
        return () => window.removeEventListener("keydown", Win_keydown)
    }, [res?.files, selectedFiles, setSelectedFiles])

    // useLayoutEffect(() => {
    //     if (!selectedFiles.length) return
    //     void scrollToSelection()
    // }, [selectedFiles])

    return { selectedFile, setSelectedFiles, selectedFiles }
}

export function scrollToSelection() {
    const container = document.documentElement
    const el = document.querySelector(`.${c.selected}`) as HTMLElement
    if (!el) return
    console.log("scrollIntoView", { scrollTop: container.scrollTop, el })
    el.scrollIntoView({ block: "center" })
}

async function setFolderSelection(key: string, value: string | null) {
    if (!value) {
        await api.deleteFolderSelection({ key })
        return
    }
    await api.saveFolderSelection({ key, value })
}
