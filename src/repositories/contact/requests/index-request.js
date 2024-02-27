import axios from "axios";

export default async function indexRequest(companyId) {
    try {
        return await axios.get(`/v1/contact/index/` +companyId);
    } catch (error) {
        throw error;
    }
}
