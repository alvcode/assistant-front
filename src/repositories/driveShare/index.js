import createRequest from "@/repositories/driveShare/requests/create-request.js";
import getOneRequest from "@/repositories/driveShare/requests/get-one-request.js";
import deleteRequest from "@/repositories/driveShare/requests/delete-request.js";

const driveShareRepository = {
    create: createRequest,
    getOne: getOneRequest,
    delete: deleteRequest,
};

export default driveShareRepository;
