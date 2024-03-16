import { css, cx } from "@emotion/css"
import React, { ReactElement, ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { colors } from "../GlobalStyle"
import { c } from "../services/c"

export function Dropdown({ toggler, popup }: { toggler: ReactElement<HTMLButtonElement>; popup: ReactNode }) {
    const [show, setShow] = useState(false)
    const [ignore, setIgnore] = useState(false)

    const toggle = useCallback(
        (e: React.MouseEvent | Event) => {
            if (e.defaultPrevented || ignore) return
            const { isInDropDown, isInToggleBtn } = shouldToggleDropDown(e)
            console.log({ isInDropDown, isInToggleBtn })
            if (e.currentTarget === window) {
                if (isInDropDown || isInToggleBtn || !show) return
                setShow(false)
                return
            }
            if (isInDropDown || isInToggleBtn) {
                setShow(!show)
                setIgnore(true)
                setTimeout(() => setIgnore(false), 0)
            }
        },
        [ignore, show]
    )
    useEffect(() => {
        window.addEventListener("mousedown", toggle)
        return () => {
            window.removeEventListener("mousedown", toggle)
        }
    }, [toggle])

    const updatedToggler = React.cloneElement(toggler, { className: cx(toggler.props.className, c.dropdownToggle) })
    const ref = useRef<HTMLDivElement>(null)
    const ref2 = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
        if (!ref.current) return
        if (!ref2.current) return
        const el = ref.current
        const rect = el?.getBoundingClientRect()
        ref2.current.style.left = `${rect.left}px`
        ref2.current.style.top = `${rect.bottom}px`
    }, [show])
    return (
        <div ref={ref} className={cx(DropdownDiv, { show })} onClick={toggle}>
            {updatedToggler}
            {show &&
                createPortal(
                    <div ref={ref2} className={popupStyle}>
                        {popup}
                    </div>,
                    document.body
                )}
        </div>
    )
}

function shouldToggleDropDown(e: React.MouseEvent | Event) {
    const el = e.target as HTMLElement
    const dropDownEl = el.closest(`.${popupStyle}`)
    const isInDropDown = !!dropDownEl
    const isInToggleBtn = !!el.closest(`.${c.dropdownToggle}`)
    return { isInDropDown, isInToggleBtn }
}

const popupStyle = css`
    label: popup;
    flex-direction: column;
    position: fixed;
    border: 1px solid ${colors.bg2};
    background-color: ${colors.bg1};
    top: 40px;
    z-index: 10000;
    left: 0;
    .menu {
        display: flex;
        flex-direction: column;
    }
`
const DropdownDiv = css`
    display: flex;

    .menu {
        display: none;
        flex-direction: column;
        position: absolute;
        border: 1px solid ${colors.bg2};
        background-color: ${colors.bg1};
        top: 40px;
        z-index: 10000;
        left: 0;
    }
    &.show {
        .menu {
            display: flex;
        }
    }
`
