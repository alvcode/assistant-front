import axios from "axios";

export default async function getChunkRequest(jobID, chunkNumber) {
    try {
        return await axios.get(`/api/drive-archive/files/` +jobID +`/chunks/` +chunkNumber, {
            responseType: 'blob',
            timeout: 0,
        });
    } catch (error) {
        throw error;
    }
}
