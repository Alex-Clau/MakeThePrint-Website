// loaders.js
import { cacheItems } from "../cache/cacheItems.js";
import { cacheReviews } from "../cache/cacheReviews.js";
import { getFeaturedCategory } from "../firestore/firestoreFeaturedCategory.js";
import {localFavorites} from "../cache/localFavorites.js";

const setBackgroundClass = (bgClass) => {
    document.body.className = bgClass;
};

export const homePageLoader = () => {
    setBackgroundClass("bg-home-night");
    return null;
};

export const productsPageLoader = async () => {
    try {
        const itemsPromise = cacheItems.getAll();
        const featuredPromise = getFeaturedCategory().catch(() => {
            console.error("Using default category due to Firestore error");
            return 'all';
        });

        const [items, featuredCategory] = await Promise.all([
            itemsPromise,
            featuredPromise
        ]);

        const favorites = localFavorites.getAll();

        const itemsWithLikes = items.map(item => ({
            ...item,
            like: favorites.some(fav => fav.id === item.id)
        }));

        setBackgroundClass("bg-products-night");
        return { items: itemsWithLikes, featuredCategory, favorites, error: null };
    } catch (error) {
        setBackgroundClass("bg-products-night");
        console.error('Error loading products page:', error);
        return {
            items: null,
            featuredCategory: 'all',
            favorites: [],
            error: error.message
        };
    }
};

export const aboutPageLoader = () => {
    setBackgroundClass("bg-about-night");
    return null;
};

export const orderPageLoader = async () => {
    try {
        const reviews = await cacheReviews.getAll();
        setBackgroundClass("bg-orders-night");
        return { reviews, error: null };
    } catch (error) {
        setBackgroundClass("bg-orders-night");
        console.error('Error loading reviews:', error);
        const cacheError = cacheReviews.getError();
        return { reviews: null, error: cacheError || error.message };
    }
};

export const adminAuthPageLoader = () => {
    setBackgroundClass("bg-products-night");
    return null;
};

export const adminDashboardLoader = async () => {
    try {
        const [items, reviews, featuredCategory] = await Promise.all([
            cacheItems.getAll(),
            cacheReviews.getAll(),
            getFeaturedCategory()
        ]);
        setBackgroundClass("bg-products-night");
        return { items, reviews, featuredCategory, error: null };
    } catch (error) {
        setBackgroundClass("bg-products-night");
        console.error('Error loading admin dashboard:', error);
        return { items: null, reviews: null, featuredCategory: null, error: error.message };
    }
};

export const loginPageLoader = () => {
    setBackgroundClass("bg-login-night");
    return null;
};