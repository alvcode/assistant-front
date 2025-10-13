import axios from "axios";

export default async function getChunksInfoRequest(structID) {
    try {
        return await axios.get(`/api/drive/files/` +structID +`/chunks-info`);
    } catch (error) {
        throw error;
    }
}
