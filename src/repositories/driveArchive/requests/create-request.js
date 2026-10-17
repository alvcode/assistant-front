import axios from "axios";

export default async function createRequest(structIds) {
    try {
        return await axios.post(`/api/drive-archive`, {
            struct_ids: structIds
        });
    } catch (error) {
        throw error;
    }
}
