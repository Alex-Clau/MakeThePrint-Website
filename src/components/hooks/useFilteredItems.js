import {useMemo} from "react";

export function useFilteredItems(allItems, favoriteItems, selectedCategory, searchQuery, sortBy) {
    return useMemo(() => {
        let filtered = selectedCategory === "all" ? allItems :
            selectedCategory === "favorites" ? favoriteItems :
                allItems.filter(item => item.category === selectedCategory);

        filtered = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (sortBy === 'price-asc') {
            filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'price-desc') {
            filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        return filtered;
    }, [allItems, favoriteItems, selectedCategory, searchQuery, sortBy]);
}