import axios from "axios";

export default async function getOneRequest(noteId) {
    try {
        return await axios.get(`/api/notes/` + noteId + `/share`);
    } catch (error) {
        throw error;
    }
}
