import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"
import { router } from "./router"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"
import "./index.css"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
})

// injectGlobalStyle()
const container = document.querySelector("#root") as HTMLElement
const root = createRoot(container)
root.render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
    </ThemeProvider>
)
