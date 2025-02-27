import axios from "axios";

export default async function createRequest(data) {
    try {
        return await axios.post(`/api/note-categories`, data);
    } catch (error) {
        throw error;
    }
}
