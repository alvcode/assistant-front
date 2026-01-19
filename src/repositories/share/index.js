import createRequest from "@/repositories/share/requests/create-request.js";
import getOneRequest from "@/repositories/share/requests/get-one-request.js";

const shareRepository = {
    create: createRequest,
    getOne: getOneRequest,
};

export default shareRepository;