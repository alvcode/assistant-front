import getListRequest from "@/repositories/driveRecycleBin/requests/get-list-request.js";
import restoreOneRequest from "@/repositories/driveRecycleBin/requests/restore-one-request.js";
import restoreAllRequest from "@/repositories/driveRecycleBin/requests/restore-all-request.js";
import deleteOneRequest from "@/repositories/driveRecycleBin/requests/delete-one-request.js";
import deleteAllRequest from "@/repositories/driveRecycleBin/requests/delete-all-request.js";

const driveRecycleBinRepository = {
    getList: getListRequest,
    restoreOne: restoreOneRequest,
    restoreAll: restoreAllRequest,
    deleteOne: deleteOneRequest,
    deleteAll: deleteAllRequest,
};

export default driveRecycleBinRepository;