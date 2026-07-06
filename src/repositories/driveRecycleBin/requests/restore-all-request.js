import axios from "axios";

export default async function restoreAllRequest() {
    try {
        return await axios.post(`/api/drive-recycle-bin/restore-all`);
    } catch (error) {
        throw error;
    }
}
