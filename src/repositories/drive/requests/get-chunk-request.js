import axios from "axios";

export default async function getChunkRequest(structID, chunkNumber) {
    try {
        return await axios.get(`/api/drive/files/` +structID +`/chunks/` +chunkNumber, {
            responseType: 'blob',
            timeout: 0,
        });
    } catch (error) {
        throw error;
    }
}
