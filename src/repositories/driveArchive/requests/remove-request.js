import axios from "axios";

export default async function removeRequest(jobID) {
    try {
        return await axios.delete(`/api/drive-archive/` +jobID);
    } catch (error) {
        throw error;
    }
}
