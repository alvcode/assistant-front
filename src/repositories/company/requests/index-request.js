import axios from "axios";

export default async function indexRequest() {
    try {
        return await axios.get(`/admin/company/index`);
    } catch (error) {
        throw error;
    }
}
