export function isMediaFile(name: string) {
    return isVideoFile(name) || isAudioFile(name)
}

export function isVideoFile(name: string) {
    return /\.(mp4|mkv|avi|webm|mov|wmv|flv|3gp|ogg|ogv)$/i.test(name)
}
export function isAudioFile(name: string) {
    return /\.(mp3|flac|wav|ogg|aac|wma)$/i.test(name)
}

export function isExecutable(name: string) {
    return /\.(exe|bat|com|cmd|sh)$/i.test(name)
}

export function isSubtitlesFile(name: string) {
    return /\.(srt|idx|sub)$/i.test(name)
}
