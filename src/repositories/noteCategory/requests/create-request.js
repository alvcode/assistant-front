import axios from "axios";

export default async function createRequest(data) {
    try {
        return await axios.post(`/api/notes/categories`, data);
    } catch (error) {
        throw error;
    }
}
