import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Star, Clock, Phone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Restaurant } from '@/types';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useAuthStore } from '@/store/authStore';
import {
  formatPrice,
  formatRating,
  truncateText,
  getImagePlaceholder,
  getOpeningStatus,
} from '@/utils';
import toast from 'react-hot-toast';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showDistance?: boolean;
  distance?: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  showDistance = false,
  distance,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite, isLoading } = useFavoritesStore();
  const { isOpen, nextChange } = getOpeningStatus(restaurant);
  const isFav = isFavorite(restaurant._id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to save favorites');
      return;
    }

    try {
      await toggleFavorite(restaurant);
      toast.success(
        isFav ? 'Removed from favorites' : 'Added to favorites'
      );
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card variant="elevated" padding="none" className="overflow-hidden group h-full">
        <Link to={`/restaurant/${restaurant._id}`} className="block h-full">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={getImagePlaceholder(restaurant)}
              alt={restaurant.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              disabled={isLoading}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-red-500 shadow-sm"
            >
              <Heart
                className={`h-4 w-4 ${
                  isFav ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>

            {/* Status Badge */}
            {isOpen ? (
              <Badge
                variant="success"
                size="sm"
                className="absolute top-3 left-3"
              >
                Open
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                size="sm"
                className="absolute top-3 left-3"
              >
                Closed
              </Badge>
            )}

            {/* Distance Badge */}
            {showDistance && distance && (
              <Badge
                variant="default"
                size="sm"
                className="absolute bottom-3 left-3 bg-black/70 text-white"
              >
                {distance < 1000
                  ? `${Math.round(distance)}m`
                  : `${(distance / 1000).toFixed(1)}km`}
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0 ml-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatRating(restaurant.rating)}
                </span>
              </div>
            </div>

            {/* Cuisine & Price */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" size="sm">
                {restaurant.cuisine}
              </Badge>
              <Badge variant="default" size="sm">
                {formatPrice(restaurant.priceRange)}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {truncateText(restaurant.description, 120)}
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {restaurant.location.address}, {restaurant.location.city}
              </span>
            </div>

            {/* Opening Hours */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {nextChange || 'Hours not available'}
              </span>
            </div>

            {/* Features */}
            {restaurant.features && restaurant.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {restaurant.features.slice(0, 3).map((feature, index) => (
                  <Badge
                    key={index}
                    variant="info"
                    size="sm"
                    className="text-xs"
                  >
                    {feature}
                  </Badge>
                ))}
                {restaurant.features.length > 3 && (
                  <Badge variant="secondary" size="sm" className="text-xs">
                    +{restaurant.features.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {/* Contact Info */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-3">
                {restaurant.contact.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>Phone</span>
                  </div>
                )}
                {restaurant.contact.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>Website</span>
                  </div>
                )}
              </div>
              <span>{restaurant.reviewCount} reviews</span>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;