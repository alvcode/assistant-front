import axios from "axios";

export default async function getOneRequest(driveStructId) {
    try {
        return await axios.get(`/api/drive/files/` + driveStructId + `/share`);
    } catch (error) {
        throw error;
    }
}
