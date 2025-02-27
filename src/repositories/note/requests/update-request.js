import axios from "axios";

export default async function updateRequest(data) {
    try {
        return await axios.patch(`/api/notes`, data);
    } catch (error) {
        throw error;
    }
}
