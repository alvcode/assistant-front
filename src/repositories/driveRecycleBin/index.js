import getListRequest from "@/repositories/driveRecycleBin/requests/get-list-request.js";
import restoreOneRequest from "@/repositories/driveRecycleBin/requests/restore-one-request.js";
import restoreAllRequest from "@/repositories/driveRecycleBin/requests/restore-all-request.js";

const driveRecycleBinRepository = {
    getList: getListRequest,
    restoreOne: restoreOneRequest,
    restoreAll: restoreAllRequest,
};

export default driveRecycleBinRepository;