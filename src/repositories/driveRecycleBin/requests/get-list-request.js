import axios from "axios";

export default async function getListRequest() {
    try {
        return await axios.get(`/api/drive-recycle-bin`);
    } catch (error) {
        throw error;
    }
}
