import axios from "axios";

export default async function createArchiveRequest(hash) {
    try {
        return await axios.post(`/api/drive-share/` + hash + `/archive/create`);
    } catch (error) {
        throw error;
    }
}
