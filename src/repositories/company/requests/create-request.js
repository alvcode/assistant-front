import axios from "axios";

export default async function createRequest(data) {
    try {
        return await axios.post(`/v1/company/create`, data);
    } catch (error) {
        throw error;
    }
}
