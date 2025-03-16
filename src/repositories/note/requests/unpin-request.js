import axios from "axios";

export default async function unpinRequest(noteId) {
    try {
        return await axios.post(`/api/notes/` + noteId + `/unpin`);
    } catch (error) {
        throw error;
    }
}
