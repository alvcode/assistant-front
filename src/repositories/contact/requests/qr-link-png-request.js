import axios from "axios";

export default async function qrLinkPngRequest(data) {
    try {
        return await axios.post(`/v1/contact/qr-link-png`, data, { responseType: 'blob' });
    } catch (error) {
        throw error;
    }
}