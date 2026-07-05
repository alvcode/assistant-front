import getListRequest from "@/repositories/driveRecycleBin/requests/get-list-request.js";
import restoreOneRequest from "@/repositories/driveRecycleBin/requests/restore-one-request.js";

const driveRecycleBinRepository = {
    getList: getListRequest,
    restoreOne: restoreOneRequest,
};

export default driveRecycleBinRepository;