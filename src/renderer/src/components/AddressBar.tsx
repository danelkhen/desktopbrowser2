import { css } from "@emotion/css"
import { Box, Input } from "@mui/material"

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
        <Box className={style}>
            <Box component="form" onSubmit={gotoPath} sx={{ flex: 1 }}>
                <Input
                    disableUnderline
                    fullWidth
                    type="text"
                    name="path"
                    className="tbPath"
                    placeholder="Path"
                    value={path}
                    onChange={e => setPath(e.currentTarget.value)}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </Box>
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
        </Box>
    )
}
const style = css`
    label: AddressBar;
    display: flex;
    padding: 5px 2px;
    .tbPath {
        border-radius: 10px;
        padding: 4px 20px;
        background-color: #000;
    }
`
// const style = css`
//     label: AddressBar;
//     padding: 0.25em 0.5em;
//     font-size: 14px;
//     display: flex;
//     > form {
//         display: flex;
//         flex: 1;
//     }
//     #tbPath {
//         flex: 1;
//         display: block;
//         border: none;
//         font-size: 0.8em;
//         -webkit-font-smoothing: antialiased;
//         padding: 0.5em;
//         border-bottom: 1px solid #282828;
//         transition: all 0.3s ease;
//     }
//     #tbPath:last-child {
//         margin-right: 0;
//     }
//     #tbPath:hover {
//         border-bottom: 1px solid #323232;
//     }
//     #tbPath:active,
//     #tbPath:focus {
//         outline: none;
//     }
//     .right-side {
//         display: block;
//         margin-right: 2.74614%;
//         text-align: right;
//     }
//     .right-side:last-child {
//         margin-right: 0;
//     }
//     .right-side #tbSearch {
//         border-radius: 20px;
//         border: 1px solid #141414;
//         font-size: 0.833em;
//         -webkit-font-smoothing: antialiased;
//         padding: 0.25em 0.5em;
//         transition: all 0.3s ease;
//     }
//     .right-side #tbSearch:hover {
//         border-bottom: 1px solid #323232;
//     }
//     .right-side #tbSearch:active,
//     .right-side #tbSearch:focus {
//         outline: none;
//     }
// `
