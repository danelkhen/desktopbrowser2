import AudiotrackOutlinedIcon from "@mui/icons-material/AudiotrackOutlined"
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined"
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined"
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined"
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined"
import { IFile } from "../../../shared/IFile"
import { isAudioFile, isVideoFile } from "../../../shared/isMediaFile"

export function FileIcon({ file }: { file: IFile }) {
    if (file.isFolder) return <FolderOpenOutlinedIcon />
    if (file.isLink) return <LinkOutlinedIcon />
    if (isVideoFile(file.name)) return <VideocamOutlinedIcon />
    if (isAudioFile(file.name)) return <AudiotrackOutlinedIcon />
    return <InsertDriveFileOutlinedIcon />
}
