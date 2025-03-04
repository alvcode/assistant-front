import axios from "axios";

export default async function updateRequest(categoryId, data) {
    try {
        return await axios.patch(`/api/note-categories/` +categoryId, data);
    } catch (error) {
        throw error;
    }
}
