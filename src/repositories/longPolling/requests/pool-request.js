import axios from "axios";

export default async function poolRequest({ signal, lastEventId } = {}) {
    try {
        let url = `/api/long-polling/pool`;
        if (lastEventId !== undefined && lastEventId !== null) {
            url += `?last_event_id=${lastEventId}`;
        }
        return await axios.get(url, { timeout: 30000, signal });
    } catch (error) {
        throw error;
    }
}
