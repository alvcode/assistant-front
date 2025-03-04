import allRequest from "@/repositories/noteCategory/requests/all-request.js"
import createRequest from "@/repositories/noteCategory/requests/create-request.js";
import deleteRequest from "@/repositories/noteCategory/requests/delete-request.js";
import updateRequest from "@/repositories/noteCategory/requests/update-request.js";


const noteCategoryRepository = {
    all: allRequest,
    create: createRequest,
    delete: deleteRequest,
    update: updateRequest,
};

export default noteCategoryRepository;