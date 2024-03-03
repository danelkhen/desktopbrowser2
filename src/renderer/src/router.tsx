import { createBrowserRouter } from "react-router-dom"
import { FileBrowser } from "./components/FileBrowser"
import { Tray } from "./Tray/Tray"
import { App } from "./App"
import { Version } from "./Version"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <FileBrowser />,
            },
            {
                path: "/tray",
                element: <Tray />,
            },
            {
                path: "/version",
                element: <Version />,
            },
            {
                index: true,
                path: "/*",
                element: <FileBrowser />,
            },
        ],
    },
])
