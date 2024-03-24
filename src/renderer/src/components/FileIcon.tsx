import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined"
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined"
import NoteOutlinedIcon from "@mui/icons-material/NoteOutlined"
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined"
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined"
import { IFile } from "../../../shared/IFile"
import { isAudioFile, isVideoFile } from "../../../shared/isMediaFile"
import { IVlcStatus } from "../../../shared/Api"
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined"
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined"
import { c } from "../services/c"

export function FileIcon({ file, vlcStatus }: { file: IFile; vlcStatus: IVlcStatus }) {
    if (file.isFolder) return <FolderOpenOutlinedIcon className={c.small} />
    if (file.isLink) return <LinkOutlinedIcon />
    if (vlcStatus.path === file.path) {
        if (vlcStatus.playing) return <PauseCircleOutlineOutlinedIcon />
        return <PlayCircleOutlineOutlinedIcon />
    }

    if (isVideoFile(file.name)) return <VideocamOutlinedIcon />
    if (isAudioFile(file.name)) return <AudiotrackOutlinedIcon />
    return <NoteOutlinedIcon className={c.small} />
}
