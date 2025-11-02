import { createCollectionCache } from "./collectionCache.js";

export const cacheItems = createCollectionCache("items", 5 * 60 * 1000);

export async function getItems() {
    return cacheItems.getAll();
}

export async function updateCachedItem(items, itemId, docId, updates) {
    return cacheItems.update(items, itemId, docId, updates);
}

export async function addCachedItem(items, newItem) {
    return cacheItems.add(items, newItem);
}

export async function removeCachedItem(items, itemId, docId) {
    return cacheItems.remove(items, itemId, docId);
}
