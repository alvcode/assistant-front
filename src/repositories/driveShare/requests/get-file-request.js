import axios from "axios";

export default async function getFileRequest(hash) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/download`, {
            responseType: 'blob',
            timeout: 0,
        });
    } catch (error) {
        throw error;
    }
}
