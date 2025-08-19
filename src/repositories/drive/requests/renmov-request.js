import axios from "axios";

export default async function renMovRequest(structIds, parentId) {
    try {
        return await axios.patch('/api/drive/renmov', {parent_id: parentId, struct_ids: structIds});
    } catch (error) {
        throw error;
    }
}
