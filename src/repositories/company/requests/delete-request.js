import axios from "axios";

export default async function indexRequest(companyId) {
    try {
        return await axios.delete(`/admin/company/` +companyId);
    } catch (error) {
        throw error;
    }
}
