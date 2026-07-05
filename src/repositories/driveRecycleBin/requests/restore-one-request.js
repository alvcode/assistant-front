import axios from "axios";

export default async function restoreOneRequest(recycleBinId) {
    try {
        return await axios.post(`/api/drive-recycle-bin/restore-one/` + recycleBinId);
    } catch (error) {
        throw error;
    }
}
