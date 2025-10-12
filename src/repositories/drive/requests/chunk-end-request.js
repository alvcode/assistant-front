import axios from "axios";

export default async function chunkEndRequest(structId) {
    try {
        return await axios.post('/api/drive/chunk-end', {
            struct_id: structId,
        });
    } catch (error) {
        throw error;
    }
}