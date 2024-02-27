import axios from "axios";

export default async function updateRequest(data, contactId) {
    try {
        return await axios.patch(`/v1/contact/` +contactId, data);
    } catch (error) {
        throw error;
    }
}
