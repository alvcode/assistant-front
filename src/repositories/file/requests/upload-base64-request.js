import axios from "axios";

export default async function uploadBase64Request(base64) {
    try {
        return await axios.post(`/v1/file/upload-image-base64`, {file: base64});
    } catch (error) {
        throw error;
    }
}
