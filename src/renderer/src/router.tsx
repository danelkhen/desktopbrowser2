import { createBrowserRouter } from "react-router"
import { App } from "./App"
import { Tray } from "./Tray/Tray"
import { Version } from "./Version"
import { FileBrowser } from "./components/FileBrowser"
import { parseRequest, toListFilesReq } from "./components/parseRequest"
import { api } from "./services/api"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/!/tray",
                element: <Tray />,
            },
            {
                path: "/!/version",
                element: <Version />,
            },
            {
                path: "/*?",
                element: <FileBrowser />,
                loader: async x => {
                    const url = new URL(x.request.url)
                    const req = parseRequest(url.pathname, url.search)
                    const req2 = toListFilesReq(req)
                    const res = await api.listFiles(req2)
                    console.log("loader", x, res)
                    return res
                },
            },
        ],
    },
])
