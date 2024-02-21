import axios from "axios";

export default async function createRequest(data) {
    try {
        return await axios.post(`/admin/contact/create`, data);
    } catch (error) {
        throw error;
    }
}
