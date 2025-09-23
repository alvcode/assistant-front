import axios from "axios";

export default async function getFileRequest(itemID) {
    try {
        return await axios.get(`/api/drive/files/` +itemID, {
            responseType: 'blob',
            timeout: 0,
        });
    } catch (error) {
        throw error;
    }
}
