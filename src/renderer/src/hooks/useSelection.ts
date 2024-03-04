import { useEffect, useMemo } from "react"
import { IFile } from "../../../shared/IFile"
import { IFileMeta } from "../../../shared/IFileMeta"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { Selection } from "../lib/Selection"
import { sleep } from "../lib/sleep"
import { dispatcher } from "../services/Dispatcher"
import { c } from "../services/c"
import { calcItemsOnScreen } from "./calcItemsOnScreen"
import { fileRow } from "../services/fileRow"

export function useSelection({
    filesMd,
    res,
    selectedFiles,
    setSelectedFiles,
}: {
    readonly res: IListFilesRes
    readonly filesMd: { [key: string]: IFileMeta }
    readonly selectedFiles: IFile[]
    setSelectedFiles: (v: IFile[]) => void
}) {
    useEffect(() => {
        const selectedFileName = res.file?.name ? filesMd?.[res.file.name]?.selectedFiles?.[0] : null
        const files = res?.files?.filter(t => t.name == selectedFileName) ?? []
        const selection = files
        setSelectedFiles(selection)
    }, [setSelectedFiles, filesMd, res.file?.name, res?.files])

    useEffect(() => {
        const v = selectedFiles
        const file = v[v.length - 1]
        if (res?.file?.name) {
            console.log("saveSelectionAndSetSelectedItems", res.file.name, file?.name)
            void dispatcher.saveSelectedFile(res.file.name, file?.name)
        }
    }, [res.file?.name, selectedFiles])
    useEffect(() => {
        console.log("verifySelectionInView", selectedFiles)
        void verifySelectionInView()
    }, [selectedFiles])

    // Keyboard selection
    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            const itemsOnScreen = calcItemsOnScreen(document.querySelector(`.${fileRow}`))
            const selection = new Selection<IFile>({ all: res?.files ?? [], selected: selectedFiles, itemsOnScreen })
            const selectedFile = selection.selectedItem
            const target = e.target as HTMLElement
            if (target.matches("input:not(#tbQuickFind),select")) return
            ;(document.querySelector("#tbQuickFind") as HTMLElement).focus()
            const newSelection = selection.keyDown(e)
            setSelectedFiles(newSelection.selected)
            if (e.defaultPrevented) return
            if (e.key == "Enter") {
                const file = selectedFile
                if (!file) return
                e.preventDefault()
                void dispatcher.Open(selectedFile)
            } else if (e.key == "Backspace") {
                dispatcher.up()
            }
        }
        window.addEventListener("keydown", Win_keydown)
        return () => window.removeEventListener("keydown", Win_keydown)
    }, [res, selectedFiles, setSelectedFiles])

    const service = useMemo(() => {
        return {
            setSelectedFiles,
            selectedFile: selectedFiles[selectedFiles.length - 1],
        }
    }, [selectedFiles, setSelectedFiles])

    return service
}

async function verifySelectionInView() {
    await sleep(10)
    const el = document.querySelector(`.${c.selected}`) as HTMLElement
    if (el == null) return
    const container = document.documentElement
    const containerHeight = container.clientHeight - 100

    const top = el.offsetTop - 50
    const bottom = el.offsetTop + el.offsetHeight

    const top2 = container.scrollTop
    const bottom2 = container.scrollTop + containerHeight

    console.log({ top, bottom, top2, bottom2, containerHeight })

    let finalTop: number | null = null

    if (top < top2) {
        finalTop = top
    } else if (bottom > bottom2) {
        const finalBottom = bottom
        finalTop = finalBottom - containerHeight
    }

    if (finalTop == null) return
    console.log("scrolling", { finalTop, top, top2, bottom2, bottom })
    container.scrollTop = finalTop
}
