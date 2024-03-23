import { useCallback, useEffect, useState } from "react"
import { IFile } from "../../../shared/IFile"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { Selection } from "../lib/Selection"
import { iterableLast } from "../lib/iterableLast"
import { c } from "../services/c"
import { fileRow } from "../services/fileRow"
import { calcItemsOnScreen } from "./calcItemsOnScreen"

export function useSelection({
    res,
    setFolderSelection,
}: {
    readonly res: IListFilesRes
    setFolderSelection: (key: string, value: string | null) => Promise<void>
}) {
    const [selectedFiles, _setSelectedFiles] = useState<IFile[]>([])
    useEffect(() => {
        const fm = res.file?.name ? res.selections?.[res.file?.name] : null
        const selectedFileName = fm ?? null
        const file = res?.files?.find(t => t.name === selectedFileName)
        _setSelectedFiles(file ? [file] : [])
    }, [res.file?.name, res?.files, res.selections])

    const selectedFile: IFile | null = selectedFiles[selectedFiles.length - 1] ?? null

    const setSelectedFiles = useCallback(
        async (selectedFiles: IFile[]) => {
            if (!res?.file?.name) {
                return
            }
            const selectedFile = iterableLast(selectedFiles)
            console.log("saveSelectionAndSetSelectedItems", res.file.name, selectedFile?.name)
            _setSelectedFiles(Array.from(selectedFiles))
            await setFolderSelection(res.file.name, selectedFile?.name ?? null)
        },
        [res?.file?.name, setFolderSelection]
    )

    // useLayoutEffect(() => {
    //     if (!selectedFiles.length) return
    //     void verifySelectionInView()
    // }, [selectedFiles])

    // Keyboard selection
    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            const itemsOnScreen = calcItemsOnScreen(document.querySelector(`.${fileRow}`))
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

    return { selectedFile, setSelectedFiles, selectedFiles }
}

export function scrollToSelection() {
    const container = document.documentElement
    const el = document.querySelector(`.${c.selected}`) as HTMLElement
    if (!el) return
    console.log("scrollIntoView", { scrollTop: container.scrollTop, el })
    el.scrollIntoView({ block: "center" })
}
