import React, { useState } from 'react';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CuisineType, PriceRange, FeatureType, RestaurantFilters } from '@/types';
import { cn } from '@/utils';

interface SearchFiltersProps {
  filters: RestaurantFilters;
  onFiltersChange: (filters: RestaurantFilters) => void;
  filterOptions?: {
    cuisines: CuisineType[];
    cities: string[];
    features: FeatureType[];
    priceRanges: PriceRange[];
  };
  isLoading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  filterOptions = {
    cuisines: [],
    cities: [],
    features: [],
    priceRanges: ['budget', 'mid-range', 'fine-dining'],
  },
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      onFiltersChange({ ...filters, search: value || undefined });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (key: keyof RestaurantFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.cuisine) count++;
    if (filters.priceRange) count++;
    if (filters.city) count++;
    if (filters.features && filters.features.length > 0) count++;
    if (filters.rating) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <Input
          icon={Search}
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
          disabled={isLoading}
        />
        
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0"
          disabled={isLoading}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" size="sm" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Filters:</span>
          
          {filters.cuisine && (
            <Badge variant="default" className="flex items-center gap-1">
              {filters.cuisine}
              <button
                onClick={() => handleFilterChange('cuisine', undefined)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.priceRange && (
            <Badge variant="default" className="flex items-center gap-1">
              {filters.priceRange}
              <button
                onClick={() => handleFilterChange('priceRange', undefined)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.city && (
            <Badge variant="default" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {filters.city}
              <button
                onClick={() => handleFilterChange('city', undefined)}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {filters.features?.map((feature, index) => (
            <Badge key={index} variant="default" className="flex items-center gap-1">
              {feature}
              <button
                onClick={() => {
                  const newFeatures = filters.features?.filter(f => f !== feature);
                  handleFilterChange('features', newFeatures?.length ? newFeatures : undefined);
                }}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Cuisine */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Cuisine
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.cuisines.map((cuisine) => (
                      <label
                        key={cuisine}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="cuisine"
                          value={cuisine}
                          checked={filters.cuisine === cuisine}
                          onChange={(e) => 
                            handleFilterChange('cuisine', e.target.checked ? cuisine : undefined)
                          }
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {cuisine}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    {filterOptions.priceRanges.map((price) => (
                      <label
                        key={price}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          value={price}
                          checked={filters.priceRange === price}
                          onChange={(e) => 
                            handleFilterChange('priceRange', e.target.checked ? price : undefined)
                          }
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {price.replace('-', ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    City
                  </label>
                  <select
                    value={filters.city || ''}
                    onChange={(e) => handleFilterChange('city', e.target.value || undefined)}
                    className="input w-full"
                  >
                    <option value="">Any city</option>
                    {filterOptions.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Features
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.features.slice(0, 8).map((feature) => (
                      <label
                        key={feature}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.features?.includes(feature) || false}
                          onChange={(e) => {
                            const currentFeatures = filters.features || [];
                            if (e.target.checked) {
                              handleFilterChange('features', [...currentFeatures, feature]);
                            } else {
                              handleFilterChange(
                                'features',
                                currentFeatures.filter(f => f !== feature)
                              );
                            }
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[4.0, 4.5, 5.0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', filters.rating === rating ? undefined : rating)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                        filters.rating === rating
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      )}
                    >
                      {rating}+ ⭐
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;