import axios from "axios";

export default async function getDetailItemRequest(hash) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/detail-item`);
    } catch (error) {
        throw error;
    }
}
