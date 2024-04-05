import { Menu, MenuItem, MenuItemProps, MenuList } from "@mui/material"
import React, { ReactNode, useEffect, useState } from "react"

export function MenuListGroup({
    header,
    renderHeader,
    children,
    className,
    headerProps,
    group,
}: {
    header?: ReactNode
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderHeader?: (props: any) => ReactNode
    headerProps?: MenuItemProps
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
            {renderHeader ? (
                renderHeader({ onClick: (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget) })
            ) : (
                <MenuItem onClick={e => setAnchorEl(e.currentTarget)} {...headerProps}>
                    {header}
                </MenuItem>
            )}
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)} className={className}>
                {children}
            </Menu>
        </MenuList>
    ) : (
        <MenuList className={className}>{children}</MenuList>
    )
}
