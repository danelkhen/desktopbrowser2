import { Menu, MenuItem, MenuList } from "@mui/material"
import { ReactNode, useEffect, useState } from "react"

export function MenuListGroup({
    header,
    children,
    className,
    group,
}: {
    header?: ReactNode
    children?: ReactNode
    className?: string
    group?: boolean
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    useEffect(() => {
        if (!group) setAnchorEl(null)
    }, [group])

    return group ? (
        <MenuList className={className}>
            <MenuItem onClick={e => setAnchorEl(e.currentTarget)}>{header}</MenuItem>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} className={className}>
                {children}
            </Menu>
        </MenuList>
    ) : (
        <MenuList className={className}>{children}</MenuList>
    )
}
