import { create } from 'zustand';
import { Restaurant } from '@/types';
import { userAPI } from '@/utils/api';
import { useAuthStore } from './authStore';

interface FavoritesState {
  favorites: Restaurant[];
  favoriteIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadFavorites: () => Promise<void>;
  addToFavorites: (restaurant: Restaurant) => Promise<void>;
  removeFromFavorites: (restaurantId: string) => Promise<void>;
  toggleFavorite: (restaurant: Restaurant) => Promise<void>;
  isFavorite: (restaurantId: string) => boolean;
  clearFavorites: () => void;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  favoriteIds: new Set(),
  isLoading: false,
  error: null,

  loadFavorites: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    try {
      set({ isLoading: true, error: null });
      const response = await userAPI.getFavorites();
      
      const favoriteIds = new Set(response.favorites.map(r => r._id));
      
      set({
        favorites: response.favorites,
        favoriteIds,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load favorites';
      set({ error: errorMessage, isLoading: false });
    }
  },

  addToFavorites: async (restaurant: Restaurant) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add favorites');
    }

    try {
      set({ error: null });
      await userAPI.addToFavorites(restaurant._id);
      
      const { favorites, favoriteIds } = get();
      const newFavorites = [...favorites, restaurant];
      const newFavoriteIds = new Set([...favoriteIds, restaurant._id]);
      
      set({
        favorites: newFavorites,
        favoriteIds: newFavoriteIds,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add to favorites';
      set({ error: errorMessage });
      throw error;
    }
  },

  removeFromFavorites: async (restaurantId: string) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw new Error('You must be logged in to remove favorites');
    }

    try {
      set({ error: null });
      await userAPI.removeFromFavorites(restaurantId);
      
      const { favorites, favoriteIds } = get();
      const newFavorites = favorites.filter(r => r._id !== restaurantId);
      const newFavoriteIds = new Set([...favoriteIds]);
      newFavoriteIds.delete(restaurantId);
      
      set({
        favorites: newFavorites,
        favoriteIds: newFavoriteIds,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to remove from favorites';
      set({ error: errorMessage });
      throw error;
    }
  },

  toggleFavorite: async (restaurant: Restaurant) => {
    const { isFavorite } = get();
    
    if (isFavorite(restaurant._id)) {
      await get().removeFromFavorites(restaurant._id);
    } else {
      await get().addToFavorites(restaurant);
    }
  },

  isFavorite: (restaurantId: string) => {
    const { favoriteIds } = get();
    return favoriteIds.has(restaurantId);
  },

  clearFavorites: () => {
    set({
      favorites: [],
      favoriteIds: new Set(),
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));