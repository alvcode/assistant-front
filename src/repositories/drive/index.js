import getSpaceRequest from "@/repositories/drive/requests/get-space-request.js";
import getTreeRequest from "@/repositories/drive/requests/get-tree-request.js";
import createDirectoryRequest from "@/repositories/drive/requests/create-directory-request.js";
import deleteRequest from "@/repositories/drive/requests/delete-request.js";
import uploadRequest from "@/repositories/drive/requests/upload-request.js";
import renameRequest from "@/repositories/drive/requests/rename-request.js";
import renMovRequest from "@/repositories/drive/requests/renmov-request.js";
import getFileRequest from "@/repositories/drive/requests/get-file-request.js";
import chunkPrepareRequest from "@/repositories/drive/requests/chunk-prepare-request.js";
import uploadChunkRequest from "@/repositories/drive/requests/upload-chunk-request.js";
import chunkEndRequest from "@/repositories/drive/requests/chunk-end-request.js";

const driveRepository = {
    getSpace: getSpaceRequest,
    getTree: getTreeRequest,
    createDirectory: createDirectoryRequest,
    delete: deleteRequest,
    upload: uploadRequest,
    rename: renameRequest,
    renMov: renMovRequest,
    getFile: getFileRequest,
    chunkPrepare: chunkPrepareRequest,
    uploadChunk: uploadChunkRequest,
    chunkEnd: chunkEndRequest,
};

export default driveRepository;