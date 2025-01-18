import { LinkProps, Link as MuiLink } from "@mui/material"
import { forwardRef } from "react"
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router"

// eslint-disable-next-line react/display-name
export const AppLinkBehavior = forwardRef<
    HTMLAnchorElement,
    Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
    const { href, ...other } = props
    // Map href (Material UI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} />
})
export function AppLink(props: LinkProps) {
    return <MuiLink component={AppLinkBehavior} {...props} />
}
