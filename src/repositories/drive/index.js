import getSpaceRequest from "@/repositories/drive/requests/get-space-request.js";
import getTreeRequest from "@/repositories/drive/requests/get-tree-request.js";

const driveRepository = {
    getSpace: getSpaceRequest,
    getTree: getTreeRequest,
};

export default driveRepository;