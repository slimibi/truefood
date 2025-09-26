import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  description: string;
  cuisine: string;
  priceRange: 'budget' | 'mid-range' | 'fine-dining';
  location: {
    address: string;
    city: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
  };
  images: string[];
  rating: number;
  reviewCount: number;
  features: string[];
  openingHours: {
    [key: string]: {
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
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    enum: [
      'Italian', 'French', 'Japanese', 'Chinese', 'Indian', 'Mexican', 
      'Thai', 'Mediterranean', 'American', 'Korean', 'Vietnamese', 'Greek',
      'Spanish', 'Turkish', 'Lebanese', 'Moroccan', 'Brazilian', 'Fusion',
      'Fast Food', 'Seafood', 'Steakhouse', 'Vegetarian', 'Vegan', 'Other'
    ],
  },
  priceRange: {
    type: String,
    required: [true, 'Price range is required'],
    enum: ['budget', 'mid-range', 'fine-dining'],
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true,
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        index: '2dsphere',
      },
    },
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be valid',
    },
  }],
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0,
  },
  reviewCount: {
    type: Number,
    min: [0, 'Review count cannot be negative'],
    default: 0,
  },
  features: [{
    type: String,
    enum: [
      'Outdoor Seating', 'WiFi', 'Parking', 'Delivery', 'Takeout', 
      'Reservations', 'Kids Friendly', 'Pet Friendly', 'Bar', 'Wine Bar',
      'Live Music', 'Credit Cards', 'Wheelchair Accessible', 
      'Private Dining', 'Catering', 'Brunch', 'Late Night', 'Counter Seating', 
      'Sake Bar', 'Vegetarian', 'Vegan'
    ],
  }],
  openingHours: {
    monday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    tuesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    wednesday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    thursday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    friday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    saturday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
    sunday: {
      open: String,
      close: String,
      closed: { type: Boolean, default: false },
    },
  },
  contact: {
    phone: String,
    website: String,
    email: String,
  },
}, {
  timestamps: true,
});

restaurantSchema.index({ 'location.coordinates': '2dsphere' });
restaurantSchema.index({ cuisine: 1, priceRange: 1, rating: -1 });

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);