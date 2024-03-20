import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react"
import { IFile } from "../../../shared/IFile"
import { IListFilesReq } from "../../../shared/IListFilesReq"
import { IListFilesRes } from "../../../shared/IListFilesRes"
import { Selection } from "../lib/Selection"
import { iterableLast } from "../lib/iterableLast"
import { sleep } from "../lib/sleep"
import { useDispatcher } from "../services/Dispatcher"
import { c } from "../services/c"
import { fileRow } from "../services/fileRow"
import { calcItemsOnScreen } from "./calcItemsOnScreen"
import { FolderSelections } from "../../../shared/Api"

export function useSelection({
    req,
    res,
    setRes,
    folderSelections,
    setFolderSelections,
}: {
    req: IListFilesReq
    readonly res: IListFilesRes
    setRes: Dispatch<SetStateAction<IListFilesRes>>
    folderSelections: FolderSelections
    setFolderSelections: Dispatch<SetStateAction<FolderSelections>>
}) {
    const { setFolderSelection, up, Open } = useDispatcher({ req, res, setRes, folderSelections, setFolderSelections })
    // const { folderSelections: filesMd } = useAppState()
    const [_extraSelectedFiles, _setExtraSelectedFiles] = useState<IFile[]>([])

    const selectedFiles = useMemo(() => {
        const fm = res.file?.name ? folderSelections[res.file?.name] : null
        const selectedFileName = fm ?? null
        const files = res?.files?.filter(t => t.name === selectedFileName) ?? []
        return new Set([...files, ..._extraSelectedFiles])
    }, [_extraSelectedFiles, folderSelections, res.file?.name, res?.files])

    const selectedFile = useMemo(() => iterableLast(selectedFiles), [selectedFiles])

    const setSelectedFiles = useCallback(
        async (selectedFiles: Set<IFile>) => {
            if (!res?.file?.name) {
                return
            }
            const selectedFile = iterableLast(selectedFiles)
            console.log("saveSelectionAndSetSelectedItems", res.file.name, selectedFile?.name)
            _setExtraSelectedFiles(Array.from(selectedFiles).slice(0, selectedFiles.size - 1))
            await setFolderSelection(res.file.name, selectedFile?.name ?? null)
        },
        [res?.file?.name, setFolderSelection]
    )

    // useEffect(() => {
    //     if (!res?.file?.name) {
    //         return
    //     }
    //     const file = iterableLast(selectedFiles)
    //     console.log("saveSelectionAndSetSelectedItems", res.file.name, file?.name)
    //     void dispatcher.saveSelectedFile(res.file.name, file?.name ?? null)
    // }, [res.file?.name, selectedFiles])
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
            const selectedFile = selection.lastSelected
            const target = e.target as HTMLElement
            if (target.matches("input:not(#tbQuickFind),select")) return
            ;(document.querySelector("#tbQuickFind") as HTMLElement).focus()
            const newSelection = selection.keyDown(e)
            void setSelectedFiles(newSelection.selected)
            if (e.defaultPrevented) return
            if (e.key === "Enter") {
                const file = selectedFile
                if (!file) return
                e.preventDefault()
                void Open(selectedFile)
            } else if (e.key === "Backspace") {
                up()
            }
        }
        window.addEventListener("keydown", Win_keydown)
        return () => window.removeEventListener("keydown", Win_keydown)
    }, [Open, res?.files, selectedFiles, setSelectedFiles, up])

    return { selectedFile, setSelectedFiles, selectedFiles }
}

async function verifySelectionInView() {
    await sleep(10)
    const el = document.querySelector(`.${c.selected}`) as HTMLElement
    if (el === null) return
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

    if (finalTop === null) return
    console.log("scrolling", { finalTop, top, top2, bottom2, bottom })
    container.scrollTop = finalTop
}
