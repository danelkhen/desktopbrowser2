import { useCallback, useEffect, useMemo } from "react"
import { sleep } from "../lib/sleep"
import { Selected } from "../services/Classes"
import { dispatcher } from "../services/Dispatcher"
import { FileInfo, FsFile, ListFilesResponse } from "../services/FileService"
import { Selection } from "../services/Selection"

export function useSelection({
    filesMd,
    res,
    selectedFiles,
}: {
    readonly res: ListFilesResponse
    readonly filesMd: { [key: string]: FileInfo }
    readonly selectedFiles: FsFile[]
}) {
    useEffect(() => {
        const selectedFileName = res.File?.Name ? filesMd?.[res.File.Name]?.selectedFiles?.[0] : null
        const files = res?.Files?.filter(t => t.Name == selectedFileName) ?? []
        const selection = files
        dispatcher._setSelectedFiles(selection)
    }, [filesMd, res?.File?.Name, res?.Files])

    const setSelectedFiles = useCallback(
        (v: FsFile[]) => {
            const file = v[v.length - 1]
            if (res?.File?.Name) {
                console.log("saveSelectionAndSetSelectedItems", res.File.Name, file?.Name)
                dispatcher.saveSelectedFile(res.File.Name, file?.Name)
            }
            console.log("selectedFiles", v)
            dispatcher._setSelectedFiles(v)
            verifySelectionInView()
        },
        [res?.File?.Name]
    )

    // Keyboard selection
    useEffect(() => {
        function Win_keydown(e: KeyboardEvent): void {
            if (e.defaultPrevented) return
            const selection = new Selection<FsFile>(res?.Files ?? [], selectedFiles)
            const selectedFile = selection.selectedItem
            const target = e.target as HTMLElement
            if (target.matches("input:not(#tbQuickFind),select")) return
            ;(document.querySelector("#tbQuickFind") as HTMLElement).focus()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSelectedFiles(selection.KeyDown(e as any))
            if (e.defaultPrevented) return
            if (e.key == "Enter") {
                const file = selectedFile
                if (!file) return
                e.preventDefault()
                dispatcher.Open(selectedFile)
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
            selectedFiles,
            selectedFile: selectedFiles[selectedFiles.length - 1],
        }
    }, [selectedFiles, setSelectedFiles])

    return service
}

async function verifySelectionInView() {
    await sleep(10)
    const el = document.querySelector(`.${Selected}`) as HTMLElement
    if (el == null) return
    const container = document.body
    const containerHeight = container.clientHeight - 100

    const top = el.offsetTop
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
    console.log("scrolling", top2, finalTop)
    container.scrollTop = finalTop
}
