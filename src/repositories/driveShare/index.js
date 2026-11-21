import createRequest from "@/repositories/driveShare/requests/create-request.js";
import getOneRequest from "@/repositories/driveShare/requests/get-one-request.js";
import deleteRequest from "@/repositories/driveShare/requests/delete-request.js";
import getDetailItemRequest from "@/repositories/driveShare/requests/get-detail-item-request.js";
import getFullSizeRequest from "@/repositories/driveShare/requests/get-full-size-request.js";
import getChunksInfoRequest from "@/repositories/driveShare/requests/get-chunks-info-request.js";
import getChunkRequest from "@/repositories/driveShare/requests/get-chunk-request.js";
import getFileRequest from "@/repositories/driveShare/requests/get-file-request.js";
import createArchiveRequest from "@/repositories/driveShare/requests/create-archive-request.js";
import getArchiveStatusRequest from "@/repositories/driveShare/requests/get-archive-status-request.js";
import getArchiveChunksInfoRequest from "@/repositories/driveShare/requests/get-archive-chunks-info-request.js";
import getArchiveChunkRequest from "@/repositories/driveShare/requests/get-archive-chunk-request.js";

const driveShareRepository = {
    create: createRequest,
    getOne: getOneRequest,
    delete: deleteRequest,
    getDetailItem: getDetailItemRequest,
    getFullSize: getFullSizeRequest,
    getChunksInfo: getChunksInfoRequest,
    getChunk: getChunkRequest,
    getFile: getFileRequest,
    createArchive: createArchiveRequest,
    getArchiveStatus: getArchiveStatusRequest,
    getArchiveChunksInfo: getArchiveChunksInfoRequest,
    getArchiveChunk: getArchiveChunkRequest,
};

export default driveShareRepository;
