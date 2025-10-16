import { useState, useEffect } from 'react';

const STORAGE_KEY = 'agriconnect_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = (farmId: string) => {
    setFavorites((prev) => {
      if (prev.includes(farmId)) {
        return prev.filter((id) => id !== farmId);
      } else {
        return [...prev, farmId];
      }
    });
  };

  const isFavorite = (farmId: string) => favorites.includes(farmId);

  const clearFavorites = () => setFavorites([]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
}
