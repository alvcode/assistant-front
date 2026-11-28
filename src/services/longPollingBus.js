import longPollingRepository from "@/repositories/longPolling/index.js";

const subscribers = new Map();

const RETRY_DELAY_MIN = 2000;
const RETRY_DELAY_MAX = 30000;

let isRunning = false;
let currentAbortController = null;
let lastEventId = null;
let retryDelay = RETRY_DELAY_MIN;
let retryTimer = null;

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

    retryTimer = null;
    currentAbortController = new AbortController();

    let events = [];
    let failed = false;
    try {
        const response = await longPollingRepository.pool({ signal: currentAbortController.signal, lastEventId });
        events = response.data || [];
        retryDelay = RETRY_DELAY_MIN;
    } catch (error) {
        failed = !currentAbortController?.signal?.aborted;
    }

    if (!isRunning) {
        return;
    }

    if (Array.isArray(events) && events.length) {
        const last = events[events.length - 1];
        if (last && last.id !== undefined && last.id !== null) {
            lastEventId = last.id;
        }
        events.forEach(dispatch);
    }

    if (failed) {
        // Сервер недоступен — ждём дольше перед следующей попыткой.
        const delay = retryDelay;
        retryDelay = Math.min(retryDelay * 2, RETRY_DELAY_MAX);
        retryTimer = setTimeout(() => {
            poll();
        }, delay);
        return;
    }

    poll();
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
    retryDelay = RETRY_DELAY_MIN;
    window.addEventListener("pagehide", handlePageHide);
    poll();
}

function stop() {
    isRunning = false;
    window.removeEventListener("pagehide", handlePageHide);
    if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
    }
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
