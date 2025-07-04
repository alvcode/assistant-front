import getSpaceRequest from "@/repositories/drive/requests/get-space-request.js";
import getTreeRequest from "@/repositories/drive/requests/get-tree-request.js";
import createDirectoryRequest from "@/repositories/drive/requests/create-directory-request.js";
import deleteRequest from "@/repositories/drive/requests/delete-request.js";

const driveRepository = {
    getSpace: getSpaceRequest,
    getTree: getTreeRequest,
    createDirectory: createDirectoryRequest,
    delete: deleteRequest,
};

export default driveRepository;