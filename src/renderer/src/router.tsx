import { createBrowserRouter } from "react-router-dom"
import { App } from "./App"
import { Tray } from "./Tray/Tray"
import { Version } from "./Version"
import { FileBrowser } from "./components/FileBrowser"

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
