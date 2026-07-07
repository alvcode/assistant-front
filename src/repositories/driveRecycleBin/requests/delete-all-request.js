import axios from "axios";

export default async function deleteAllRequest() {
    try {
        return await axios.post(`/api/drive-recycle-bin/force-delete-all`);
    } catch (error) {
        throw error;
    }
}
