import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PriceRange, Restaurant } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceRange: PriceRange): string {
  const priceMap: Record<PriceRange, string> = {
    budget: '$',
    'mid-range': '$$',
    'fine-dining': '$$$',
  };
  return priceMap[priceRange];
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function formatDistance(distance: number): string {
  if (distance < 1000) {
    return `${Math.round(distance)}m`;
  }
  return `${(distance / 1000).toFixed(1)}km`;
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function isRestaurantOpen(restaurant: Restaurant): boolean {
  const now = new Date();
  const currentDay = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof Restaurant['openingHours'];
  const currentTime = now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  const todayHours = restaurant.openingHours[currentDay];
  if (!todayHours || todayHours.closed) return false;

  const { open, close } = todayHours;
  
  // Handle overnight hours (e.g., 22:00 to 02:00)
  if (close < open) {
    return currentTime >= open || currentTime <= close;
  }
  
  return currentTime >= open && currentTime <= close;
}

export function getOpeningStatus(restaurant: Restaurant): {
  isOpen: boolean;
  nextChange: string | null;
} {
  const now = new Date();
  const isOpen = isRestaurantOpen(restaurant);
  
  // This is a simplified version - you could enhance it to show exact next opening/closing time
  const currentDay = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase() as keyof Restaurant['openingHours'];
    
  const todayHours = restaurant.openingHours[currentDay];
  
  if (!todayHours || todayHours.closed) {
    return { isOpen: false, nextChange: 'Closed today' };
  }

  if (isOpen) {
    return { isOpen: true, nextChange: `Closes at ${todayHours.close}` };
  } else {
    return { isOpen: false, nextChange: `Opens at ${todayHours.open}` };
  }
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function generatePlaceholderImage(width = 400, height = 300): string {
  return `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
}

export function getImagePlaceholder(restaurant: Restaurant): string {
  if (restaurant.images && restaurant.images.length > 0) {
    return restaurant.images[0];
  }
  return generatePlaceholderImage();
}

export function formatOpeningHours(restaurant: Restaurant): string {
  const days = Object.entries(restaurant.openingHours);
  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  
  const todayEntry = days.find(([day]) => day === today);
  if (!todayEntry) return 'Hours not available';
  
  const [_, hours] = todayEntry;
  if (hours.closed) return 'Closed today';
  
  return `${hours.open} - ${hours.close}`;
}

export function generateShareUrl(restaurant: Restaurant): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/restaurant/${restaurant._id}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function formatPhoneNumber(phone: string): string {
  // Simple phone number formatting - you can enhance this based on your needs
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}