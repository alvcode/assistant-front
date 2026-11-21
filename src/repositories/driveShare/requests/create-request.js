import axios from "axios";

export default async function createRequest(driveStructId) {
    try {
        return await axios.post(`/api/drive/files/` + driveStructId + `/share`);
    } catch (error) {
        throw error;
    }
}
