import axios from "axios";

export default async function getStatusRequest() {
    try {
        return await axios.get(`/api/drive-archive/status`);
    } catch (error) {
        throw error;
    }
}
