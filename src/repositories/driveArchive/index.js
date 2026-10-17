import getStatusRequest from "@/repositories/driveArchive/requests/get-status-request.js";
import getChunksInfoRequest from "@/repositories/driveArchive/requests/get-chunks-info-request.js";
import getChunkRequest from "@/repositories/driveArchive/requests/get-chunk-request.js";
import removeRequest from "@/repositories/driveArchive/requests/remove-request.js";
import createRequest from "@/repositories/driveArchive/requests/create-request.js";

const driveArchiveRepository = {
    getStatus: getStatusRequest,
    getChunksInfo: getChunksInfoRequest,
    getChunk: getChunkRequest,
    remove: removeRequest,
    create: createRequest,
};

export default driveArchiveRepository;