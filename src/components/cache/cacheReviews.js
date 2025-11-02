import { createCollectionCache } from "./collectionCache.js";

export const cacheReviews = createCollectionCache(
    "reviews",
    3 * 60 * 1000,
    { approved: false, createdAt: new Date() }
);

export async function getReviews() {
    return cacheReviews.getAll();
}

export async function approveCachedReview(reviews, reviewId, docId) {
    return cacheReviews.update(reviews, reviewId, docId, {
        approved: true,
        approvedAt: new Date()
    });
}

export async function addCachedReview(reviews, newReview) {
    return cacheReviews.add(reviews, newReview);
}

export async function rejectCachedReview(reviews, reviewId, docId) {
    return cacheReviews.remove(reviews, reviewId, docId);
}