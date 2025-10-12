import axios from "axios";

export default async function chunkPrepareRequest(filename, fullSize, parentId) {
    try {
        return await axios.post('/api/drive/chunk-prepare', {
            filename: filename,
            full_size: fullSize,
            parent_id: parentId
        });
    } catch (error) {
        throw error;
    }
}