export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favorites: string[];
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  cuisine: CuisineType;
  priceRange: PriceRange;
  location: {
    address: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  rating: number;
  reviewCount: number;
  features: FeatureType[];
  openingHours: {
    [key in DayOfWeek]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  contact: {
    phone?: string;
    website?: string;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type CuisineType =
  | 'Italian'
  | 'French'
  | 'Japanese'
  | 'Chinese'
  | 'Indian'
  | 'Mexican'
  | 'Thai'
  | 'Mediterranean'
  | 'American'
  | 'Korean'
  | 'Vietnamese'
  | 'Greek'
  | 'Spanish'
  | 'Turkish'
  | 'Lebanese'
  | 'Moroccan'
  | 'Brazilian'
  | 'Fusion'
  | 'Fast Food'
  | 'Seafood'
  | 'Steakhouse'
  | 'Vegetarian'
  | 'Vegan'
  | 'Other';

export type PriceRange = 'budget' | 'mid-range' | 'fine-dining';

export type FeatureType =
  | 'Outdoor Seating'
  | 'WiFi'
  | 'Parking'
  | 'Delivery'
  | 'Takeout'
  | 'Reservations'
  | 'Kids Friendly'
  | 'Pet Friendly'
  | 'Bar'
  | 'Live Music'
  | 'Credit Cards'
  | 'Wheelchair Accessible'
  | 'Private Dining'
  | 'Catering'
  | 'Brunch'
  | 'Late Night';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface RestaurantFilters {
  cuisine?: CuisineType;
  priceRange?: PriceRange;
  city?: string;
  features?: FeatureType[];
  rating?: number;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param: string; location: string }>;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  pagination: Pagination;
}

export interface FilterOptions {
  cuisines: CuisineType[];
  cities: string[];
  features: FeatureType[];
  priceRanges: PriceRange[];
}

export interface AuthTokens {
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  cuisine?: CuisineType;
  priceRange?: PriceRange;
  city?: string;
  features?: FeatureType[];
  search?: string;
  rating?: number;
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}