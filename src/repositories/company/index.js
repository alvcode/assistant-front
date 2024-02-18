import indexRequest from "@/repositories/company/requests/index-request.js";
import deleteRequest from "@/repositories/company/requests/delete-request.js";

const companyRepository = {
    index: indexRequest,
    delete: deleteRequest,
};

export default companyRepository;