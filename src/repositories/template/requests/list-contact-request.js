import axios from "axios";

export default async function listContactRequest() {
    try {
        return await axios.get(`/v1/template/list-contact`);
    } catch (error) {
        throw error;
    }
}
