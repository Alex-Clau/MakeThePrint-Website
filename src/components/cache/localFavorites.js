const FAVORITES_KEY = 'user_favorites';

export const localFavorites = {
    getAll() {
        try {
            const favorites = localStorage.getItem(FAVORITES_KEY);
            return favorites ? JSON.parse(favorites) : [];
        } catch {
            console.log('Error loading favorites from local storage');
            return [];
        }
    },

    add(item) {
        try {
            const favorites = this.getAll();
            const newFavorites = [...favorites, { ...item, like: true }];
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return newFavorites;
        } catch (error) {
            console.log('Error adding favorite');
            throw error;
        }
    },

    remove(itemId) {
        try {
            const favorites = this.getAll();
            const newFavorites = favorites.filter(item => item.id !== itemId);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            return newFavorites;
        } catch (error) {
            console.log('Error removing favorite');
            throw error;
        }
    },

    clear() {
        localStorage.removeItem(FAVORITES_KEY);
    }
};