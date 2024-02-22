import indexRequest from "@/repositories/contact/requests/index-request.js";
import createRequest from "@/repositories/contact/requests/create-request.js";
import deleteRequest from "@/repositories/contact/requests/delete-request.js";

const contactRepository = {
    index: indexRequest,
    create: createRequest,
    delete: deleteRequest,
};

export default contactRepository;