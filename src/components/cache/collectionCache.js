import { getCachedData, setCachedData, cachedOperation } from "./cacheUtils.js";
import { fetchCollection, addDocument, updateDocument, removeDocument} from "../firestore/firestoreUtils.js";

export function createCollectionCache(collectionName, ttl = 5 * 60 * 1000, customAddFields = {}) {
    const state = {
        error: null
    };

    return {
        async getAll(forceRefresh = false) {
            state.error = null;

            try {
                if (!forceRefresh) {
                    const cached = getCachedData(collectionName, ttl);
                    if (cached) return cached;
                }

                const items = await fetchCollection(collectionName);
                setCachedData(collectionName, items);
                return items;
            } catch (err) {
                console.error(`Error fetching ${collectionName}:`, err);

                const staleCache = getCachedData(collectionName, Infinity);
                if (staleCache) {
                    state.error = {
                        title: "Using cached data",
                        message: "Could not fetch fresh data. Showing cached version."
                    };
                    return staleCache;
                }

                state.error = {
                    title: "Error occurred",
                    message: err.message || `Could not fetch ${collectionName}`
                };
                throw err;
            }
        },

        async update(items, itemId, docId, updates) {
            state.error = null;
            try {
                return await cachedOperation(
                    collectionName,
                    items,
                    itemId,
                    docId,
                    updates,
                    updateDocument,
                    'update'
                );
            } catch (err) {
                state.error = {
                    title: "Update failed",
                    message: err.message || "Could not update item"
                };
                throw err;
            }
        },

        async add(items, newItem) {
            state.error = null;
            try {
                const addWithFields = (col, data) => addDocument(col, data, customAddFields);
                return await cachedOperation(
                    collectionName,
                    items,
                    null,
                    null,
                    newItem,
                    addWithFields,
                    'add'
                );
            } catch (err) {
                state.error = {
                    title: "Add failed",
                    message: err.message || "Could not add item"
                };
                throw err;
            }
        },

        async remove(items, itemId, docId) {
            state.error = null;
            try {
                return await cachedOperation(
                    collectionName,
                    items,
                    itemId,
                    docId,
                    null,
                    removeDocument,
                    'remove'
                );
            } catch (err) {
                state.error = {
                    title: "Remove failed",
                    message: err.message || "Could not remove item"
                };
                throw err;
            }
        },

        getError() {
            return state.error;
        },

        clearError() {
            state.error = null;
        },

        clearCache() {
            const cacheKey = `${collectionName}-cache`;
            try {
                localStorage.removeItem(cacheKey);
            } catch (err) {
                console.warn("Error clearing cache:", err);
            }
        }
    };
}