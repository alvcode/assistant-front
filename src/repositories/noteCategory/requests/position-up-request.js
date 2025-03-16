import axios from "axios";

export default async function positionUpRequest(categoryId) {
    try {
        return await axios.post(`/api/note-categories/position-up`, {id: categoryId});
    } catch (error) {
        throw error;
    }
}
