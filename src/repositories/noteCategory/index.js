import allRequest from "@/repositories/noteCategory/requests/all-request.js"
import createRequest from "@/repositories/noteCategory/requests/create-request.js";
import deleteRequest from "@/repositories/noteCategory/requests/delete-request.js";


const noteCategoryRepository = {
    all: allRequest,
    create: createRequest,
    delete: deleteRequest,
};

export default noteCategoryRepository;