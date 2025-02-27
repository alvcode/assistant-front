import getAllRequest from "@/repositories/note/requests/get-all-request.js";
import createRequest from "@/repositories/note/requests/create-request.js";
import updateRequest from "@/repositories/note/requests/update-request.js";
import getOneRequest from "@/repositories/note/requests/get-one-request.js";

const noteRepository = {
    all: getAllRequest,
    create: createRequest,
    update: updateRequest,
    one: getOneRequest,
};

export default noteRepository;