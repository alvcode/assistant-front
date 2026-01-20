import axios from "axios";

export default async function getByHashRequest(hash) {
    try {
        return await axios.get(`/api/notes-share/` + hash + `/one`);
    } catch (error) {
        throw error;
    }
}
