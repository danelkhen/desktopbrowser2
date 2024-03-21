import { IListFilesReq } from "../../../shared/IListFilesReq"

export type GetNavUrl = (v: IListFilesReq | ((prev: IListFilesReq) => IListFilesReq)) => string
