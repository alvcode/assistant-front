import axios from "axios";

export default async function indexRequest(companyId) {
    try {
        return await axios.get(`/admin/contact/index/` +companyId);
    } catch (error) {
        throw error;
    }
}
