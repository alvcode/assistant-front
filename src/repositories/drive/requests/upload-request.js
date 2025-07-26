import axios from "axios";

export default async function uploadRequest(file, parentId) {
    try {
        const form = new FormData();
        form.append('file', file);

        let uri = '/api/drive/upload-file';
        if (parentId) {
            uri += '?parentId=' + parentId;
        }

        return await axios.post(uri, form);
    } catch (error) {
        throw error;
    }
}
