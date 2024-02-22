import axios from "axios";

export default async function deleteRequest(companyId) {
    try {
        return await axios.delete(`/admin/company/` +companyId);
    } catch (error) {
        throw error;
    }
}
