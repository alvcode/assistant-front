import allRequest from "@/repositories/noteCategory/requests/all-request.js"
import createRequest from "@/repositories/noteCategory/requests/create-request.js";


const noteCategoryRepository = {
    all: allRequest,
    create: createRequest,
};

export default noteCategoryRepository;