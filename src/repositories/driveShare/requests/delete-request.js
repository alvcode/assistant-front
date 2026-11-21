import axios from "axios";

export default async function deleteRequest(driveStructId) {
    try {
        return await axios.delete(`/api/drive/files/` + driveStructId + `/share`);
    } catch (error) {
        throw error;
    }
}
