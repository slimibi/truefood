import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Restaurant from '@/models/Restaurant';
import { connectDB } from '@/config/database';

dotenv.config();

const sampleRestaurants = [
  {
    name: "Chez Laurent",
    description: "An authentic French bistro offering classic dishes with a modern twist. Our chef brings 20 years of experience from Lyon to create unforgettable dining experiences.",
    cuisine: "French",
    priceRange: "fine-dining",
    location: {
      address: "123 Rue de la Paix",
      city: "Paris",
      coordinates: { type: 'Point', coordinates: [2.3522, 48.8566] }
    },
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5b958?w=800"
    ],
    rating: 4.8,
    reviewCount: 247,
    features: ["Reservations", "Wine Bar", "Outdoor Seating", "Private Dining"],
    openingHours: {
      monday: { open: "18:00", close: "23:00", closed: false },
      tuesday: { open: "18:00", close: "23:00", closed: false },
      wednesday: { open: "18:00", close: "23:00", closed: false },
      thursday: { open: "18:00", close: "23:00", closed: false },
      friday: { open: "18:00", close: "24:00", closed: false },
      saturday: { open: "18:00", close: "24:00", closed: false },
      sunday: { open: "", close: "", closed: true }
    },
    contact: {
      phone: "+33 1 42 86 87 88",
      website: "https://chezlaurent.fr",
      email: "info@chezlaurent.fr"
    }
  },
  {
    name: "Sakura Sushi",
    description: "Fresh sushi and authentic Japanese cuisine in a modern setting. Our master sushi chef creates artful presentations using the finest ingredients.",
    cuisine: "Japanese",
    priceRange: "mid-range",
    location: {
      address: "456 Cherry Blossom Ave",
      city: "Tokyo",
      coordinates: { type: 'Point', coordinates: [139.6503, 35.6762] }
    },
    images: [
      "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800",
      "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800"
    ],
    rating: 4.6,
    reviewCount: 189,
    features: ["Takeout", "Delivery", "Sake Bar", "Counter Seating"],
    openingHours: {
      monday: { open: "17:00", close: "22:00", closed: false },
      tuesday: { open: "17:00", close: "22:00", closed: false },
      wednesday: { open: "17:00", close: "22:00", closed: false },
      thursday: { open: "17:00", close: "22:00", closed: false },
      friday: { open: "17:00", close: "23:00", closed: false },
      saturday: { open: "12:00", close: "23:00", closed: false },
      sunday: { open: "12:00", close: "21:00", closed: false }
    },
    contact: {
      phone: "+81 3 1234 5678",
      website: "https://sakurasushi.jp"
    }
  },
  {
    name: "Mama Mia Pizzeria",
    description: "Traditional wood-fired pizzas made with love and family recipes passed down for generations. Authentic Italian flavors in every bite.",
    cuisine: "Italian",
    priceRange: "budget",
    location: {
      address: "789 Little Italy Street",
      city: "New York",
      coordinates: { type: 'Point', coordinates: [-74.0060, 40.7128] }
    },
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800"
    ],
    rating: 4.4,
    reviewCount: 312,
    features: ["Delivery", "Takeout", "Kids Friendly", "Outdoor Seating"],
    openingHours: {
      monday: { open: "11:00", close: "23:00", closed: false },
      tuesday: { open: "11:00", close: "23:00", closed: false },
      wednesday: { open: "11:00", close: "23:00", closed: false },
      thursday: { open: "11:00", close: "23:00", closed: false },
      friday: { open: "11:00", close: "24:00", closed: false },
      saturday: { open: "11:00", close: "24:00", closed: false },
      sunday: { open: "12:00", close: "22:00", closed: false }
    },
    contact: {
      phone: "+1 212 555 0123",
      website: "https://mamamiapizza.com"
    }
  },
  {
    name: "Spice Garden",
    description: "Aromatic Indian cuisine featuring traditional spices and modern techniques. From mild kormas to fiery vindaloos, we cater to all palates.",
    cuisine: "Indian",
    priceRange: "mid-range",
    location: {
      address: "321 Curry Lane",
      city: "Mumbai",
      coordinates: { type: 'Point', coordinates: [72.8777, 19.0760] }
    },
    images: [
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800"
    ],
    rating: 4.5,
    reviewCount: 156,
    features: ["Vegetarian", "Vegan", "Delivery", "Catering", "WiFi"],
    openingHours: {
      monday: { open: "12:00", close: "22:00", closed: false },
      tuesday: { open: "12:00", close: "22:00", closed: false },
      wednesday: { open: "12:00", close: "22:00", closed: false },
      thursday: { open: "12:00", close: "22:00", closed: false },
      friday: { open: "12:00", close: "23:00", closed: false },
      saturday: { open: "12:00", close: "23:00", closed: false },
      sunday: { open: "12:00", close: "22:00", closed: false }
    },
    contact: {
      phone: "+91 22 1234 5678",
      email: "hello@spicegarden.in"
    }
  },
  {
    name: "El Mariachi",
    description: "Vibrant Mexican cantina serving authentic street food and creative cocktails. Live mariachi music on weekends adds to the festive atmosphere.",
    cuisine: "Mexican",
    priceRange: "budget",
    location: {
      address: "555 Fiesta Boulevard",
      city: "Mexico City",
      coordinates: { type: 'Point', coordinates: [-99.1332, 19.4326] }
    },
    images: [
      "https://images.unsplash.com/photo-1565299585323-38174c14bd37?w=800",
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800"
    ],
    rating: 4.3,
    reviewCount: 203,
    features: ["Bar", "Live Music", "Outdoor Seating", "Late Night", "Kids Friendly"],
    openingHours: {
      monday: { open: "11:00", close: "23:00", closed: false },
      tuesday: { open: "11:00", close: "23:00", closed: false },
      wednesday: { open: "11:00", close: "23:00", closed: false },
      thursday: { open: "11:00", close: "24:00", closed: false },
      friday: { open: "11:00", close: "02:00", closed: false },
      saturday: { open: "11:00", close: "02:00", closed: false },
      sunday: { open: "12:00", close: "22:00", closed: false }
    },
    contact: {
      phone: "+52 55 1234 5678",
      website: "https://elmariachi.mx"
    }
  },
  {
    name: "Green Bowl",
    description: "Fresh, healthy, and delicious vegetarian and vegan options. Locally sourced ingredients and sustainable practices make dining guilt-free.",
    cuisine: "Vegetarian",
    priceRange: "mid-range",
    location: {
      address: "777 Health Street",
      city: "San Francisco",
      coordinates: { type: 'Point', coordinates: [-122.4194, 37.7749] }
    },
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800"
    ],
    rating: 4.7,
    reviewCount: 128,
    features: ["Vegan", "Vegetarian", "WiFi", "Outdoor Seating", "Takeout"],
    openingHours: {
      monday: { open: "08:00", close: "21:00", closed: false },
      tuesday: { open: "08:00", close: "21:00", closed: false },
      wednesday: { open: "08:00", close: "21:00", closed: false },
      thursday: { open: "08:00", close: "21:00", closed: false },
      friday: { open: "08:00", close: "22:00", closed: false },
      saturday: { open: "09:00", close: "22:00", closed: false },
      sunday: { open: "09:00", close: "20:00", closed: false }
    },
    contact: {
      phone: "+1 415 555 0789",
      website: "https://greenbowl.com",
      email: "info@greenbowl.com"
    }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('🗑️ Existing restaurants cleared');

    // Insert sample restaurants
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    console.log(`✅ ${restaurants.length} restaurants seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase, sampleRestaurants };