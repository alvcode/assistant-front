import axios from "axios";

export default async function renameRequest(id, newName) {
    try {
        let uri = '/api/drive/files/' + id + '/rename';

        return await axios.patch(uri, {
            name: newName
        });
    } catch (error) {
        throw error;
    }
}
