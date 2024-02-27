import axios from "axios";

export default async function deleteRequest(contactId) {
    try {
        return await axios.delete(`/v1/contact/` +contactId);
    } catch (error) {
        throw error;
    }
}
