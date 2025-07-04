import axios from "axios";

export default async function createDirectoryRequest(name, parentId) {
    try {
        return await axios.post(`/api/drive/directories`, {
            name: name,
            parent_id: parentId
        });
    } catch (error) {
        throw error;
    }
}
