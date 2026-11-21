import axios from "axios";

export default async function getArchiveChunkRequest(hash, jobId, chunkNumber) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/archive/` + jobId + `/chunks/` + chunkNumber, {
            responseType: 'blob',
            timeout: 0,
        });
    } catch (error) {
        throw error;
    }
}
