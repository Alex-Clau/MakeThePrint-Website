export function getCachedData(collectionName, ttl) {
    try {
        const cacheKey = `${collectionName}-cache`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const {items, time} = JSON.parse(cached);
        const isExpired = Date.now() - time > ttl;

        return isExpired ? null : items;
    } catch (err) {
        console.warn("Error reading cache:", err);
        return null;
    }
}

export function setCachedData(collectionName, items) {
    try {
        const cacheKey = `${collectionName}-cache`;
        localStorage.setItem(
            cacheKey,
            JSON.stringify({items, time: Date.now()})
        );
    } catch (err) {
        console.warn("Error writing cache:", err);
    }
}

export async function cachedOperation(
    collectionName,
    items,
    itemId,
    docId,
    updates,
    firebaseFn,
    operationType = 'update'
) {
    try {
        if (operationType === 'update') {
            await firebaseFn(collectionName, docId, updates);
            const updatedItems = items.map(item =>
                item.id === itemId ? {...item, ...updates} : item
            );
            setCachedData(collectionName, updatedItems);
            return updatedItems;
        } else if (operationType === 'add') {
            const result = await firebaseFn(collectionName, updates);
            const updatedItems = [{...result}, ...items];
            setCachedData(collectionName, updatedItems);
            return updatedItems;
        } else if (operationType === 'remove') {
            await firebaseFn(collectionName, docId);
            const updatedItems = items.filter(item => item.id !== itemId);
            setCachedData(collectionName, updatedItems);
            return updatedItems;
        }
    } catch (error) {
        console.error(`Error ${operationType} item in ${collectionName}:`, error);
        throw error;
    }
}