import axios from "axios";

export default async function getArchiveChunksInfoRequest(hash, jobId) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/archive/` + jobId + `/chunks-info`);
    } catch (error) {
        throw error;
    }
}
