import indexRequest from "@/repositories/company/requests/index-request.js";
import deleteRequest from "@/repositories/company/requests/delete-request.js";
import createRequest from "@/repositories/company/requests/create-request.js";

const companyRepository = {
    index: indexRequest,
    delete: deleteRequest,
    create: createRequest,
};

export default companyRepository;