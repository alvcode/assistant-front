import axios from "axios";

export default async function qrVCardPngRequest(data) {
    try {
        return await axios.post(`/v1/contact/qr-vcard-png`, data, { responseType: 'blob' });
    } catch (error) {
        throw error;
    }
}