import { createContext } from 'react';

export const ItemsContext = createContext({
    allItems: [],
    favoriteItems: [],
    featuredCategory: null,
    addItem: () => {},
    removeItem: () => {},
    updateItem: () => {},
    toggleLike: () => {},
    setItems: () => {},
    setFavorites: () => {},
    setFeaturedCategory: () => {},
    refresh: () => {},
    error: null,
    clearError: () => {},
});