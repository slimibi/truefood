import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import RestaurantCard from '@/components/features/RestaurantCard';
import { useQuery } from 'react-query';
import { restaurantAPI } from '@/utils/api';

const HomePage: React.FC = () => {
  const { data: featuredRestaurants, isLoading } = useQuery(
    'featured-restaurants',
    () => restaurantAPI.getRestaurants({ limit: 8, rating: 4.0 }),
    { staleTime: 1000 * 60 * 10 }
  );

  const stats = [
    { icon: Users, label: 'Happy Customers', value: '10K+' },
    { icon: Award, label: 'Restaurant Partners', value: '500+' },
    { icon: Star, label: 'Average Rating', value: '4.8' },
    { icon: TrendingUp, label: 'Cities Covered', value: '25+' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find restaurants by cuisine, location, price range, and special features.',
    },
    {
      icon: MapPin,
      title: 'Location-Based',
      description: 'Discover amazing restaurants near you with real-time distance and directions.',
    },
    {
      icon: Star,
      title: 'Verified Reviews',
      description: 'Read authentic reviews and ratings from real customers to make informed choices.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
            >
              Discover Your Next{' '}
              <span className="text-yellow-300">Culinary Adventure</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto"
            >
              From cozy cafes to fine dining, find the perfect restaurant for every occasion.
              Explore, discover, and savor the flavors that matter to you.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/restaurants">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Restaurants
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-300/20 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-red-300/20 rounded-full blur-xl animate-pulse-slow" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4"
            >
              Why Choose Foodie Finder?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              We make it easy to find the perfect dining experience with powerful features
              designed for food lovers.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="elevated" className="text-center h-full">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl mb-4 mx-auto">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4"
              >
                Featured Restaurants
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 dark:text-gray-300"
              >
                Discover some of our top-rated dining destinations.
              </motion.p>
            </div>
            <Link to="/restaurants">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRestaurants?.restaurants.slice(0, 8).map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <RestaurantCard restaurant={restaurant} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Ready to Find Your Next Favorite Restaurant?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of food lovers who trust Foodie Finder to discover amazing dining experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link to="/restaurants">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Start Exploring
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;