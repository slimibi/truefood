import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Loader2, Grid, List, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import RestaurantCard from '@/components/features/RestaurantCard';
import SearchFilters from '@/components/features/SearchFilters';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { restaurantAPI } from '@/utils/api';
import { RestaurantFilters, SearchParams } from '@/types';
import { debounce } from '@/utils';

const RestaurantsPage: React.FC = () => {
  const [filters, setFilters] = useState<RestaurantFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [debouncedFilters, setDebouncedFilters] = useState<RestaurantFilters>({});

  // Debounce filters to avoid too many API calls
  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      setDebouncedFilters(filters);
      setCurrentPage(1); // Reset to first page when filters change
    }, 300);

    debouncedUpdate();
  }, [filters]);

  // Get filter options
  const { data: filterOptions } = useQuery(
    'filter-options',
    restaurantAPI.getFilterOptions,
    { staleTime: 1000 * 60 * 30 } // 30 minutes
  );

  // Get restaurants based on current filters
  const searchParams: SearchParams = {
    page: currentPage,
    limit: 12,
    ...debouncedFilters,
  };

  const {
    data: restaurantsData,
    isLoading,
    error,
    isFetching,
  } = useQuery(
    ['restaurants', searchParams],
    () => restaurantAPI.getRestaurants(searchParams),
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      keepPreviousData: true,
    }
  );

  const handleFiltersChange = (newFilters: RestaurantFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = restaurantsData?.pagination.pages || 1;
  const restaurants = restaurantsData?.restaurants || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Discover Restaurants
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find the perfect dining experience from our curated collection of restaurants.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            filterOptions={filterOptions as any}
            isLoading={isFetching}
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {restaurantsData && (
                <>
                  Showing {Math.min((currentPage - 1) * 12 + 1, restaurantsData.pagination.total)} - {Math.min(currentPage * 12, restaurantsData.pagination.total)} of {restaurantsData.pagination.total} restaurants
                </>
              )}
            </span>
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="text-center py-12">
            <div className="text-red-500 mb-4">
              <MapPin className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We couldn't load the restaurants. Please try again.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse ${
                  viewMode === 'grid' ? 'h-96' : 'h-48'
                }`}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && restaurants.length === 0 && (
          <Card className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <MapPin className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms to find more restaurants.
            </p>
            <Button onClick={() => setFilters({})}>
              Clear Filters
            </Button>
          </Card>
        )}

        {/* Restaurants Grid */}
        {!isLoading && restaurants.length > 0 && (
          <>
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <RestaurantCard 
                    restaurant={restaurant}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = currentPage <= 3 
                    ? i + 1 
                    : currentPage + i - 2;
                  
                  if (page > totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
                
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;