import axios from "axios";

export default async function getArchiveStatusRequest(hash) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/archive/status`);
    } catch (error) {
        throw error;
    }
}
