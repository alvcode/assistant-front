import axios from "axios";

export default async function deleteRequest(itemId, force) {
    try {
        let forceQuery = '?force=';
        if (force) {
            forceQuery += '1'
        } else {
            forceQuery += '0';
        }
        return await axios.delete(`/api/drive/` + itemId + forceQuery);
    } catch (error) {
        throw error;
    }
}
