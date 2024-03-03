import { css, cx } from "@emotion/css"
import { ReactNode } from "react"

export function MenuButton({
    action,
    className,
    icon,
    disabled,
    children,
}: {
    action?: () => void
    className?: string
    icon?: ReactNode
    disabled?: boolean
    children?: ReactNode
}) {
    return (
        <button className={cx(className, btn)} onClick={action} disabled={disabled}>
            {icon}
            {children}
        </button>
    )
}

export function ToggleMenuButton({
    action,
    isActive,
    className,
    icon,
    children,
}: {
    action: () => void
    isActive: boolean
    className?: string
    icon?: ReactNode
    children?: ReactNode
}) {
    return (
        <button className={cx(className, btn, { active: isActive })} onClick={action}>
            {icon}
            {children}
        </button>
    )
}

const btn = css`
    font-family: "PT Sans", "helvetica-neue", helvetica, sans-serif;
    border: none;
    border-right: 1px solid #282828;
    border-radius: 0;
    font-size: 1em;
    color: #999;
    padding: 8px 15px 8px 30px;
    -webkit-font-smoothing: antialiased;
    background: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #a276f8;
        color: #fff;
    }
    &.active {
        outline: none;
        background-color: #a276f8;
        color: #fff;
    }
    > svg {
        margin-left: -12px;
        margin-right: 6px;
    }
`
