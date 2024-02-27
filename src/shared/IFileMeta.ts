export interface IFileMeta {
    readonly key: string
    readonly collection: string
    readonly selectedFiles?: string[]
    readonly tmdbKey?: string
    readonly episodeKey?: string
    readonly watched?: boolean
    readonly lastKnownPath?: string
    readonly scanned?: string
}
