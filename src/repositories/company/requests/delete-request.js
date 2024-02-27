import axios from "axios";

export default async function deleteRequest(companyId) {
    try {
        return await axios.delete(`/v1/company/` +companyId);
    } catch (error) {
        throw error;
    }
}
