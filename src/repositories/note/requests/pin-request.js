import axios from "axios";

export default async function pinRequest(noteId) {
    try {
        return await axios.post(`/api/notes/` + noteId + `/pin`);
    } catch (error) {
        throw error;
    }
}
