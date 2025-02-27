import axios from "axios";

export default async function deleteRequest(catId) {
    try {
        return await axios.delete(`/api/note-categories/` + catId);
    } catch (error) {
        throw error;
    }
}
