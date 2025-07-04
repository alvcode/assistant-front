import axios from "axios";

export default async function deleteRequest(itemId) {
    try {
        return await axios.delete(`/api/drive/` + itemId);
    } catch (error) {
        throw error;
    }
}
