import axios from "axios";

export default async function getChunkRequest(hash, chunkNumber) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/chunks/` + chunkNumber, {
            responseType: 'blob',
            timeout: 0,
        });
    } catch (error) {
        throw error;
    }
}
