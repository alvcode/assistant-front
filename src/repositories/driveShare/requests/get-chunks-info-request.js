import axios from "axios";

export default async function getChunksInfoRequest(hash) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/chunks-info`);
    } catch (error) {
        throw error;
    }
}
