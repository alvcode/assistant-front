import axios from "axios";

export default async function deleteRequest(noteId) {
    try {
        return await axios.delete(`/api/notes/` +noteId);
    } catch (error) {
        throw error;
    }
}
