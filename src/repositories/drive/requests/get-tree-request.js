import axios from "axios";

export default async function getTreeRequest(parentId) {
    try {
        let param = '';
        if (parentId && parentId > 0) {
            param = '?parentId=' + parentId;
        }
        return await axios.get(`/api/drive/tree` +param);
    } catch (error) {
        throw error;
    }
}
