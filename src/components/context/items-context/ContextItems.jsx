import {useCallback, useReducer, useState} from 'react';
import {ItemsContext} from './ItemsContext.jsx';
import {cacheItems} from "../../cache/cacheItems.js";
import {setFeaturedCategory as setFeaturedCategoryFirebase} from "../../firestore/firestoreFeaturedCategory.js";
import {localFavorites} from "../../cache/localFavorites.js";

const ACTIONS = {
    SET_ITEMS: 'SET_ITEMS',
    SET_FAVORITES: 'SET_FAVORITES',
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_ITEM: 'UPDATE_ITEM',
    TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
    SET_FEATURED_CATEGORY: 'SET_FEATURED_CATEGORY',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
};

const STORAGE_KEYS = {
    ALL_ITEMS: 'items_allItems',
    FEATURED_CATEGORY: 'items_featuredCategory',
};

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_ITEMS:
            return {
                ...state,
                allItems: [...action.payload],
            };

        case ACTIONS.SET_FAVORITES: {
            const favoriteIds = new Set(action.payload.map(fav => fav.id));
            const updatedAllItems = state.allItems.map(item => ({
                ...item,
                like: favoriteIds.has(item.id)
            }));

            return {
                ...state,
                allItems: updatedAllItems,
                favoriteItems: action.payload,
            };
        }

        case ACTIONS.REMOVE_ITEM: {
            const updatedItems = state.allItems.filter((item) => (item.id !== action.payload));
            return {
                ...state,
                allItems: updatedItems,
            };
        }

        case ACTIONS.UPDATE_ITEM: {
            const updatedItems = state.allItems.map((item) =>
                item.id === action.payload.id
                    ? {...item, ...action.payload.updatedItem}
                    : item
            );
            return {
                ...state,
                allItems: updatedItems,
            };
        }

        case ACTIONS.TOGGLE_FAVORITE: {
            const updatedItems = state.allItems.map((item) =>
                (item.id === action.payload ? {...item, like: !item.like} : item)
            );
            return {
                ...state,
                allItems: updatedItems,
                favoriteItems: updatedItems.filter((item) => (item.like)),
            };
        }

        case ACTIONS.SET_FEATURED_CATEGORY:
            return {
                ...state,
                featuredCategory: action.payload
            };

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };

        case ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
}

function ItemsContextProvider({children}) {
    const [lastLikedItem, setLastLikedItem] = useState(null);
    const [lastLikeTime, setLastLikeTime] = useState(0);
    const [state, dispatch] = useReducer(reducer, {
        allItems: [],
        favoriteItems: [],
        featuredCategory: null,
        error: null
    });

    const setItems = (items) => {
        dispatch({type: ACTIONS.SET_ITEMS, payload: items});
    };

    async function toggleLike(itemId) {
        const now = Date.now();
        if (lastLikedItem === itemId && now - lastLikeTime < 1000) return;

        const item = state.allItems.find(item => item.id === itemId);
        if (!item) return;

        setLastLikedItem(itemId);
        setLastLikeTime(now);

        // Toggle local state immediately
        dispatch({type: ACTIONS.TOGGLE_FAVORITE, payload: itemId});

        try {
            const newLikeState = !item.like;
            if (newLikeState) {
                localFavorites.add(item);
            } else {
                localFavorites.remove(itemId);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            // Rollback local state
            dispatch({type: ACTIONS.TOGGLE_FAVORITE, payload: itemId});
        }
    }

    const setFavorites = useCallback((favorites) => {
        if (!Array.isArray(favorites)) return;

        dispatch({
            type: ACTIONS.SET_FAVORITES,
            payload: favorites
        });
    }, []);

    async function addItem(newItem) {
        dispatch({type: ACTIONS.ADD_ITEM, payload: newItem});
        try {
            await cacheItems.add(state.allItems, newItem);
        } catch (error) {
            console.error("Error adding item:", error);
            dispatch({type: ACTIONS.REMOVE_ITEM, payload: newItem.id});
        }
    }

    async function removeItem(id) {
        const item = state.allItems.find(item => item.id === id);
        if (item) {
            dispatch({type: ACTIONS.REMOVE_ITEM, payload: id});
            try {
                await cacheItems.remove(state.allItems, id, item.docId);
            } catch (error) {
                console.error("Error removing item:", error);
                dispatch({type: ACTIONS.ADD_ITEM, payload: item});
            }
        }
    }

    async function updateItem(id, updatedItem) {
        const item = state.allItems.find(item => item.id === id);
        dispatch({type: ACTIONS.UPDATE_ITEM, payload: {id, updatedItem}});
        try {
            await cacheItems.update(state.allItems, id, item.docId, updatedItem);
        } catch (error) {
            console.error("Error updating item:", error);
            dispatch({type: ACTIONS.REMOVE_ITEM, payload: id});
        }
    }

    const setFeaturedCategory = async (category) => {
        dispatch({type: ACTIONS.SET_FEATURED_CATEGORY, payload: category});

        try {
            await setFeaturedCategoryFirebase(category);
        } catch (error) {
            console.log("Error setting featured category:", error);
        }
    };

    const clearError = () => {
        cacheItems.clearError();
        dispatch({type: ACTIONS.CLEAR_ERROR});
    };

    const itemsContext = {
        allItems: state.allItems,
        favoriteItems: state.favoriteItems,
        featuredCategory: state.featuredCategory,
        addItem,
        removeItem,
        updateItem,
        toggleLike,
        setFeaturedCategory,
        setItems,
        setFavorites,
        error: state.error,
        clearError,
    };

    return (
        <ItemsContext.Provider value={itemsContext}>
            {children}
        </ItemsContext.Provider>
    );
}

export default ItemsContextProvider;