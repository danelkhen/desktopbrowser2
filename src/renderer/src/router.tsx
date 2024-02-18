import { createBrowserRouter } from "react-router-dom"
import { FileBrowser } from "./components/FileBrowser"
import { Tray } from "./Tray/Tray"
import { AppComponent } from "./AppComponent"
import { Version } from "./Version"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppComponent />,
        children: [
            {
                index: true,
                element: <FileBrowser />,
            },
            {
                path: "tray",
                element: <Tray />,
            },
            {
                path: "version",
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
