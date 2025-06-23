import axios from "axios";

export default async function getSpaceRequest() {
    try {
        return await axios.get(`/api/drive/space`);
    } catch (error) {
        throw error;
    }
}
