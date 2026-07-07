import axios from "axios";

export default async function deleteOneRequest(recycleBinId) {
    try {
        return await axios.post(`/api/drive-recycle-bin/force-delete/` + recycleBinId);
    } catch (error) {
        throw error;
    }
}
