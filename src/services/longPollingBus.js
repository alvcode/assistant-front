import longPollingRepository from "@/repositories/longPolling/index.js";

const subscribers = new Map();

let isRunning = false;
let currentAbortController = null;
let lastEventId = null;

function dispatch(event) {
    const handlers = subscribers.get(event.eventKey);
    if (!handlers) {
        return;
    }
    handlers.forEach(handler => {
        try {
            handler(event.payload);
        } catch (error) {
            console.error(`[longPolling] handler error for "${event.eventKey}"`, error);
        }
    });
}

async function poll() {
    if (!isRunning) {
        return;
    }

    currentAbortController = new AbortController();

    let events = [];
    try {
        const response = await longPollingRepository.pool({ signal: currentAbortController.signal, lastEventId });
        events = response.data || [];
    } catch (error) {
        // Соединение оборвано (таймаут/сеть/abort) — просто переподключаемся.
    }

    if (Array.isArray(events) && events.length) {
        const last = events[events.length - 1];
        if (last && last.id !== undefined && last.id !== null) {
            lastEventId = last.id;
        }
        events.forEach(dispatch);
    }

    if (isRunning) {
        poll();
    }
}

function handlePageHide() {
    stop();
}

function subscribe(eventKey, handler) {
    if (!subscribers.has(eventKey)) {
        subscribers.set(eventKey, new Set());
    }
    subscribers.get(eventKey).add(handler);

    return () => unsubscribe(eventKey, handler);
}

function unsubscribe(eventKey, handler) {
    const handlers = subscribers.get(eventKey);
    if (!handlers) {
        return;
    }
    handlers.delete(handler);
    if (handlers.size === 0) {
        subscribers.delete(eventKey);
    }
}

function start() {
    if (isRunning) {
        return;
    }
    isRunning = true;
    window.addEventListener("pagehide", handlePageHide);
    poll();
}

function stop() {
    isRunning = false;
    window.removeEventListener("pagehide", handlePageHide);
    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }
}

export default {
    subscribe,
    unsubscribe,
    start,
    stop,
};
