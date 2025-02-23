import axios from "axios";

export default async function getAllRequest(categoryId) {
    try {
        return await axios.get(`/api/notes?categoryId=` +categoryId);
    } catch (error) {
        throw error;
    }
}
