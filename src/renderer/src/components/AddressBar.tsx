import { css } from "@emotion/css"

export function AddressBar({
    gotoPath,
    path,
    search,
    setPath,
    setSearch,
    prevPage,
    nextPage,
    pageIndex,
    totalPages,
}: {
    path: string
    search: string
    pageIndex: number
    totalPages: number | null
    setPath: (v: string) => void
    setSearch: (v: string) => void
    gotoPath: () => void
    prevPage: () => void
    nextPage: () => void
}) {
    return (
        <div className={style}>
            <form onSubmit={gotoPath}>
                <input
                    type="text"
                    name="path"
                    id="tbPath"
                    placeholder="Path"
                    value={path}
                    onChange={e => setPath(e.currentTarget.value)}
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
            </form>
            <div className="right-side">
                {(totalPages || 0) > 1 && (
                    <span id="pager" className="Pager">
                        <button className="PrevPage" onMouseDown={prevPage}>
                            {"<"}
                        </button>
                        <button className="PagerInfo">
                            {pageIndex + 1} / {totalPages}
                        </button>
                        <button className="NextPage" onMouseDown={nextPage}>
                            {">"}
                        </button>
                    </span>
                )}
                <span className="find">
                    <input
                        type="text"
                        id="tbSearch"
                        value={search}
                        onChange={e => setSearch(e.currentTarget.value)}
                        placeholder="Find Something"
                    />
                </span>
            </div>
        </div>
    )
}

const style = css`
    padding: 0.25em 0.5em;
    font-size: 14px;
    display: flex;
    > form {
        display: flex;
        flex: 1;
    }
    #tbPath {
        flex: 1;
        display: block;
        border: none;
        font-size: 0.8em;
        -webkit-font-smoothing: antialiased;
        padding: 0.5em;
        border-bottom: 1px solid #282828;
        transition: all 0.3s ease;
    }
    #tbPath:last-child {
        margin-right: 0;
    }
    #tbPath:hover {
        border-bottom: 1px solid #323232;
    }
    #tbPath:active,
    #tbPath:focus {
        outline: none;
    }
    .right-side {
        display: block;
        margin-right: 2.74614%;
        text-align: right;
    }
    .right-side:last-child {
        margin-right: 0;
    }
    .right-side #tbSearch {
        border-radius: 20px;
        border: 1px solid #141414;
        font-size: 0.833em;
        -webkit-font-smoothing: antialiased;
        padding: 0.25em 0.5em;
        transition: all 0.3s ease;
    }
    .right-side #tbSearch:hover {
        border-bottom: 1px solid #323232;
    }
    .right-side #tbSearch:active,
    .right-side #tbSearch:focus {
        outline: none;
    }
`
