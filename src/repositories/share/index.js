import createRequest from "@/repositories/share/requests/create-request.js";
import getOneRequest from "@/repositories/share/requests/get-one-request.js";
import deleteRequest from "@/repositories/share/requests/delete-request.js";
import getByHashRequest from "@/repositories/share/requests/get-by-hash-request.js";

const shareRepository = {
    create: createRequest,
    getOne: getOneRequest,
    delete: deleteRequest,
    getByHash: getByHashRequest,
};

export default shareRepository;