import axios from "axios";

export default async function allRequest() {
    try {
        return await axios.get(`/api/notes/categories`);
    } catch (error) {
        throw error;
    }
}
