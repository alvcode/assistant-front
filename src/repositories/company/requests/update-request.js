import axios from "axios";

export default async function updateRequest(data, companyId) {
    try {
        return await axios.patch(`/admin/company/` +companyId, data);
    } catch (error) {
        throw error;
    }
}
