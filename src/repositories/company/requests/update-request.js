import axios from "axios";

export default async function updateRequest(data, companyId) {
    try {
        return await axios.patch(`/v1/company/` +companyId, data);
    } catch (error) {
        throw error;
    }
}
