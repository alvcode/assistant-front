import axios from "axios";

export default async function deleteRequest(contactId) {
    try {
        return await axios.delete(`/admin/contact/` +contactId);
    } catch (error) {
        throw error;
    }
}
