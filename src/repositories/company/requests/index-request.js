import axios from "axios";

export default async function indexRequest() {
    try {
        return await axios.get(`/v1/company/index`);
    } catch (error) {
        throw error;
    }
}
