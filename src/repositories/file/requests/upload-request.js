import axios from "axios";

export default async function uploadRequest(file) {
    try {
        const form = new FormData();
        form.append('file', file);

        return await axios.post(`/api/files`, form);
    } catch (error) {
        throw error;
    }
}
