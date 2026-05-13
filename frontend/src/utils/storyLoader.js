import api from './api';
import { LOCAL_STORIES, getLocalStoryById } from '../data/localStories';

const REQ_MS = 5000;

function sortStoriesByTitle(list) {
    return [...list].sort((a, b) => {
        const ta = (a.title || '').toLowerCase();
        const tb = (b.title || '').toLowerCase();
        if (ta !== tb) return ta.localeCompare(tb);
        return String(a._id).localeCompare(String(b._id));
    });
}

/**
 * Loads API stories when available, appends any offline-only stories, sorts A–Z by title.
 * @returns {{ stories: object[], source: 'api' | 'local' | 'mixed' }}
 */
export async function fetchStoriesList() {
    let apiStories = [];
    try {
        const res = await api.get('/stories', { timeout: REQ_MS, validateStatus: () => true });
        if (res.status === 200 && Array.isArray(res.data)) {
            apiStories = res.data;
        }
    } catch {
        /* ignore */
    }

    const apiIds = new Set(apiStories.map((s) => String(s._id)));
    const extraLocal = LOCAL_STORIES.filter((s) => !apiIds.has(String(s._id)));
    const merged = sortStoriesByTitle([...apiStories, ...extraLocal]);

    let source;
    if (apiStories.length === 0) source = 'local';
    else if (extraLocal.length === 0) source = 'api';
    else source = 'mixed';

    return { stories: merged, source };
}

/**
 * @returns {{ story: object, source: 'api' | 'local' }}
 */
export async function fetchStoryById(id) {
    const local = getLocalStoryById(id);
    try {
        const res = await api.get(`/stories/${id}`, { timeout: REQ_MS, validateStatus: () => true });
        if (res.status === 200 && res.data) {
            return { story: res.data, source: 'api' };
        }
    } catch {
        /* fall through */
    }
    if (local) {
        return { story: local, source: 'local' };
    }
    const err = new Error('Story not found');
    err.code = 'NOT_FOUND';
    throw err;
}
