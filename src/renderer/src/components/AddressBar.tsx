import { css } from "@emotion/css"
import { Input } from "@mui/material"

export function AddressBar({
    gotoPath,
    path,
    search,
    setPath,
    setSearchText,
}: {
    path: string
    search: string
    setPath: (v: string) => void
    setSearchText: (v: string) => void
    gotoPath: () => void
}) {
    return (
        <div className="flex py-1.5 px-0.5">
            <form
                className="flex-1"
                onSubmit={e => {
                    e.preventDefault()
                    gotoPath()
                }}
            >
                <Input
                    disableUnderline
                    fullWidth
                    type="text"
                    name="path"
                    className="rounded-xl py-1 px-4 bg-black"
                    placeholder="Path"
                    value={path}
                    onChange={e => setPath(e.currentTarget.value)}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </form>
            <span className="find">
                <Input
                    disableUnderline
                    type="text"
                    id="tbSearch"
                    value={search}
                    onChange={e => setSearchText(e.currentTarget.value)}
                    placeholder="Search"
                />
            </span>
        </div>
    )
}
