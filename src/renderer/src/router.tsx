import { createBrowserRouter } from "react-router-dom"
import { App } from "./App"
import { Tray } from "./Tray/Tray"
import { Version } from "./Version"
import { FileBrowser } from "./components/FileBrowser"
import { parseRequest } from "./components/parseRequest"
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
                    const res = await api.listFiles(req)
                    console.log("loader", x, res)
                    return res
                },
            },
        ],
    },
])
