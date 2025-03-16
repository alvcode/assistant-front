import getAllRequest from "@/repositories/note/requests/get-all-request.js";
import createRequest from "@/repositories/note/requests/create-request.js";
import updateRequest from "@/repositories/note/requests/update-request.js";
import getOneRequest from "@/repositories/note/requests/get-one-request.js";
import deleteRequest from "@/repositories/note/requests/delete-request.js";
import pinRequest from "@/repositories/note/requests/pin-request.js";
import unpinRequest from "@/repositories/note/requests/unpin-request.js";

const noteRepository = {
    all: getAllRequest,
    create: createRequest,
    update: updateRequest,
    one: getOneRequest,
    delete: deleteRequest,
    pin: pinRequest,
    unpin: unpinRequest,
};

export default noteRepository;