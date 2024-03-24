// const reloadFiles = useCallback(async (req: IListFilesReq) => {
//     const fetchFiles = async (req: IListFilesReq) => {
//         setRes(await api.listFiles(req))
//     }
//     if (req.folderSize) {
//         setRes(await api.listFiles({ ...req, folderSize: false }))
//     }
//     await fetchFiles(req)
// }, [])
// useEffect(() => {
//     void reloadFiles(req)
// }, [reloadFiles, req])
// useEffect(() => {
//     void (async () => {
//         const x = await api.getAllFolderSelections()
//         setFolderSelections(x)
//     })()
// }, [])
// useLoaderData() as IListFilesRes
// const [res, setRes] = useState<IListFilesRes>({})
// const [folderSelections, setFolderSelections] = useState<FolderSelections>({})
// files = useSorting(files, sorting, gridColumns)

export function fileUrlToPath(s: string) {
    return decodeURIComponent(new URL(s).pathname)
}
