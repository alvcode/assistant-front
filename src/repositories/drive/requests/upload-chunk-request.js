import axios from "axios";

export default async function uploadChunkRequest(file, structId, chunkNumber) {
    try {
        let url = '/api/drive/upload-chunk?structId=' +structId +'&chunkNumber=' +chunkNumber;

        const form = new FormData();
        form.append('file', file);

        return await axios.post(url, form, {timeout: 0});
    } catch (error) {
        throw error;
    }
}