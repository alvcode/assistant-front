import getAllRequest from "@/repositories/note/requests/get-all-request.js";
import createRequest from "@/repositories/note/requests/create-request.js";

const noteRepository = {
    all: getAllRequest,
    create: createRequest,
};

export default noteRepository;