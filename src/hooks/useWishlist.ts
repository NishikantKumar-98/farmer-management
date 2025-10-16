import { useState, useEffect } from 'react';

const STORAGE_KEY = 'agriconnect_wishlist';

interface WishlistItem {
  farmId: string;
  cropType: string;
  addedDate: string;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  }, [wishlist]);

  const addToWishlist = (farmId: string, cropType: string) => {
    if (!isInWishlist(farmId, cropType)) {
      setWishlist((prev) => [
        ...prev,
        {
          farmId,
          cropType,
          addedDate: new Date().toISOString(),
        },
      ]);
      return true;
    }
    return false;
  };

  const removeFromWishlist = (farmId: string, cropType: string) => {
    setWishlist((prev) =>
      prev.filter((item) => !(item.farmId === farmId && item.cropType === cropType))
    );
  };

  const isInWishlist = (farmId: string, cropType: string) => {
    return wishlist.some(
      (item) => item.farmId === farmId && item.cropType === cropType
    );
  };

  const clearWishlist = () => setWishlist([]);

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };
}
