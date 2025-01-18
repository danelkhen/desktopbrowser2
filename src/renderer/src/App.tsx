import { Outlet, ScrollRestoration } from "react-router"

export function App() {
    return (
        <>
            <ScrollRestoration />
            <Outlet />
        </>
    )
}
