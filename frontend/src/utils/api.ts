import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  LoginData,
  RegisterData,
  User,
  Restaurant,
  RestaurantsResponse,
  FilterOptions,
  SearchParams,
} from '@/types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<{ user: User; token: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> =
      await api.post('/auth/login', data);
    return response.data.data!;
  },

  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> =
      await api.post('/auth/register', data);
    return response.data.data!;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.get('/auth/me');
    return response.data.data!;
  },

  updateProfile: async (data: Partial<User>): Promise<{ user: User }> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.put(
      '/auth/profile',
      data
    );
    return response.data.data!;
  },
};

// Restaurant API
export const restaurantAPI = {
  getRestaurants: async (params: SearchParams = {}): Promise<RestaurantsResponse> => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const response: AxiosResponse<ApiResponse<RestaurantsResponse>> = await api.get(
      `/restaurants?${searchParams.toString()}`
    );
    return response.data.data!;
  },

  getRestaurant: async (id: string): Promise<{ restaurant: Restaurant }> => {
    const response: AxiosResponse<ApiResponse<{ restaurant: Restaurant }>> = await api.get(
      `/restaurants/${id}`
    );
    return response.data.data!;
  },

  searchNearby: async (
    latitude: number,
    longitude: number,
    radius?: number
  ): Promise<{ restaurants: Restaurant[] }> => {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      ...(radius && { radius: String(radius) }),
    });

    const response: AxiosResponse<ApiResponse<{ restaurants: Restaurant[] }>> = await api.get(
      `/restaurants/nearby?${params.toString()}`
    );
    return response.data.data!;
  },

  getFilterOptions: async (): Promise<FilterOptions> => {
    const response: AxiosResponse<ApiResponse<FilterOptions>> = await api.get(
      '/restaurants/filter-options'
    );
    return response.data.data!;
  },
};

// User API
export const userAPI = {
  getFavorites: async (): Promise<{ favorites: Restaurant[] }> => {
    const response: AxiosResponse<ApiResponse<{ favorites: Restaurant[] }>> = await api.get(
      '/users/favorites'
    );
    return response.data.data!;
  },

  addToFavorites: async (restaurantId: string): Promise<{ favorites: string[] }> => {
    const response: AxiosResponse<ApiResponse<{ favorites: string[] }>> = await api.post(
      `/users/favorites/${restaurantId}`
    );
    return response.data.data!;
  },

  removeFromFavorites: async (restaurantId: string): Promise<{ favorites: string[] }> => {
    const response: AxiosResponse<ApiResponse<{ favorites: string[] }>> = await api.delete(
      `/users/favorites/${restaurantId}`
    );
    return response.data.data!;
  },
};

export default api;