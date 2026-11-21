import axios from "axios";

export default async function getFullSizeRequest(hash) {
    try {
        return await axios.get(`/api/drive-share/` + hash + `/full-size`);
    } catch (error) {
        throw error;
    }
}
