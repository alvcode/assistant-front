import axios from "axios";

export default async function createRequest(noteId) {
    try {
        return await axios.post(`/api/notes/` + noteId + `/share`);
    } catch (error) {
        throw error;
    }
}
