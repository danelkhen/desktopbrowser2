/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VlcInformation {
    chapter: number
    chapters: number[]
    title: number
    category: VlcCategory
    titles: number[]
}
export interface VlcCategory {
    meta: VlcMeta
    [flux: string]:
        | {
              [key: string]: string
          }
        | VlcMeta
}
export interface VlcFlux {
    [flux: string]: string
}
export interface VlcAudiofilters {
    [filter: string]: string
}
export interface VlcMeta {
    encoded_by: string
    filename: string
}
export interface VlcVideoeffects {
    hue: number
    saturation: number
    contrast: number
    brightness: number
    gamma: number
}
export type VlcStats = {
    [key: string]: number
}
export type VlcAspectRatio = "1:1" | "4:3" | "5:4" | "16:9" | "16:10" | "221:100" | "235:100" | "239:100"
export type VlcState = "paused" | "playing" | "stopped"
export type VlcStatus = {
    fullscreen: boolean
    stats: VlcStats | null
    aspectratio: VlcAspectRatio | null
    audiodelay: number
    apiversion: number
    currentplid: number
    time: number
    volume: number
    length: number
    random: boolean
    audiofilters: VlcAudiofilters
    rate: number
    videoeffects: VlcVideoeffects
    state: VlcState
    loop: boolean
    version: string
    position: number
    information: VlcInformation
    repeat: boolean
    subtitledelay: number
    equalizer: any[]
}
export type VlcBrowseElement = {
    type: "dir" | "file"
    path: string
    name: string
    uid: number
    creation_time: number
    gid: number
    modification_time: number
    mode: number
    uri: string
    size: number
}
export type VlcBrowse = {
    elements: VlcBrowseElement[]
}
export type VlcPlaylistNode = {
    ro: "rw" | "ro"
    type: "node" | "leaf"
    name: string
    id: string
    duration?: number
    uri?: string
    children?: VlcPlaylistNode[]
    current?: "current"
}
export type VlcOptions = {
    host?: string
    port?: number
    username: string
    password: string
    /** update automatically status and playlist of VLC, default true. */
    autoUpdate?: boolean
    /** how many times per seconds (in ms) node-vlc-http will update the status of VLC, default 1000/30 ~ 33ms (30fps). */
    tickLengthMs?: number
    /**
     * checks that browse, status and playlist have changed since the last update of one of its elements,
     * if it the case fire browsechange, statuschange or playlistchange event. default true.
     */
    changeEvents?: boolean
    /** max tries at the first connection before throwing an error set it to -1 for infinite try, default 3 */
    maxTries?: number
    /** interval between two try in ms, default 1000 */
    triesInterval?: number
}
export declare interface VLC {
    on(event: "tick", listener: (delta: number) => void): this
    on(event: "update", listener: (status: VlcStatus, playlist: any) => void): this
    on(event: "statuschange", listener: (prev: VlcStatus, next: VlcStatus) => void): this
    on(event: "playlistchange", listener: (prev: any, next: any) => void): this
    on(event: "error", listener: (err: Error) => void): this
    /** fired when connected */
    on(event: "connect", listener: () => void): this
    on(event: string | symbol, listener: (...args: any[]) => void): this
    // private _host;
    // private _port;
    // private _autoUpdate;
    // private _changeEvents;
    // private _authorization;
    // private _tickLengthMs;
    // private _tickLengthNano;
    // private _longWaitMs;
    // private _longWaitNano;
    // private _prev;
    // private _target;
    // private _status;
    // private _playlist;
    // private _maxTries;
    // private _triesInterval;
    // constructor(options: VLCOptions);
    // private _connect;
    // private _doTick;
    // private _sendCommand;
    browse(path: string): Promise<VlcBrowse>
    updateStatus(): Promise<VlcStatus>
    updatePlaylist(): Promise<VlcPlaylistNode>
    updateAll(): Promise<[VlcStatus, VlcPlaylistNode]>
    /**
     * Add `uri` to playlist and start playback.
     */
    addToQueueAndPlay(uri: string, option?: "noaudio" | "novideo"): Promise<VlcStatus>
    /**
     * Add `uri` to playlist.
     */
    addToQueue(uri: string): Promise<VlcStatus>
    /**
     * Add subtitle to currently playing file.
     */
    addSubtitle(uri: string): Promise<VlcStatus>
    /**
     * Play playlist item `id`. If `id` is omitted, play last active item.
     */
    play(id: number): Promise<VlcStatus>
    /**
     * Toggle pause. If current state was 'stop', play item `id`, if `id` is omitted, play current item.
     * If no current item, play 1st item in the playlist.
     */
    pause(id: number): Promise<VlcStatus>
    /**
     * Stop playback.
     */
    stop(): Promise<VlcStatus>
    /**
     * Resume playback if state was 'paused', else do nothing.
     */
    resume(): Promise<VlcStatus>
    /**
     * Pause playback, do nothing if state was 'paused'.
     */
    forcePause(): Promise<VlcStatus>
    /**
     * Jump to next item in playlist.
     */
    playlistNext(): Promise<VlcStatus>
    /**
     * Jump to previous item in playlist.
     */
    playlistPrevious(): Promise<VlcStatus>
    /**
     * Delete item `id` from playlist.
     */
    playlistDelete(id: number): Promise<VlcStatus>
    /**
     * Empty playlist.
     */
    playlistEmpty(): Promise<VlcStatus>
    /**
     * Sort playlist using sort mode `mode` and order `order`.
     * If `order` = 0 then items will be sorted in normal order, if `order` = 1 ` they will be sorted in reverse order.
     * A non exhaustive list of sort modes:
     *  0 Id
     *  1 Name
     *  3 Author
     *  5 Random
     *  7 Track number
     */
    sortPlaylist(order: 0 | 1, mode: 0 | 1 | 3 | 5 | 7): Promise<VlcStatus>
    /**
     * Set audio delay.
     */
    setAudioDelay(delay: number): Promise<VlcStatus>
    /**
     * Set subtitle delay.
     */
    setSubtitleDelay(delay: number): Promise<VlcStatus>
    /**
     * Set playback rate.
     */
    setPlaybackRate(rate: number): Promise<VlcStatus>
    /**
     * Set aspect ratio.
     */
    setAspectRatio(ratio: VlcAspectRatio): Promise<VlcStatus>
    /**
     * Set volume level to `volume`.
     */
    setVolume(volume: number | string): Promise<VlcStatus>
    /**
     * Set the preamp value.
     */
    setPreamp(value: number): Promise<VlcStatus>
    /**
     * Set the gain for a specific band.
     */
    setEqualizer(band: number, gain: number): Promise<VlcStatus>
    /**
     * Set the equalizer preset as per the `id` specified.
     */
    setEqualizerPreset(id: number): Promise<VlcStatus>
    /**
     * Toggle random playback.
     */
    toggleRandom(): Promise<VlcStatus>
    /**
     * Toggle loop.
     */
    toggleLoop(): Promise<VlcStatus>
    /**
     * Toggle repeat.
     */
    toggleRepeat(): Promise<VlcStatus>
    /**
     * Toggle fullscreen.
     */
    toggleFullscreen(): Promise<VlcStatus>
    /**
     * Seek to `time`.
     * @return  {Promise<object>}
     */
    seek(time: number): Promise<VlcStatus>
    /**
     * Seek to chapter `chapter`.
     */
    seekToChapter(chapter: number): Promise<VlcStatus>
}
