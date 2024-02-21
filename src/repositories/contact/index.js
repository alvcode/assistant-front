import indexRequest from "@/repositories/contact/requests/index-request.js";
import createRequest from "@/repositories/contact/requests/create-request.js";

const contactRepository = {
    index: indexRequest,
    create: createRequest,
};

export default contactRepository;