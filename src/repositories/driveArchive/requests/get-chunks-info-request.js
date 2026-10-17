import axios from "axios";

export default async function getChunksInfoRequest(jobID) {
    try {
        return await axios.get(`/api/drive-archive/` +jobID +`/chunks-info`);
    } catch (error) {
        throw error;
    }
}