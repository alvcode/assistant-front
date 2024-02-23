import axios from "axios";

export default async function updateRequest(data, contactId) {
    try {
        return await axios.patch(`/admin/contact/` +contactId, data);
    } catch (error) {
        throw error;
    }
}
