import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Restaurant from '@/models/Restaurant';
import { IUser } from '@/models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

interface QueryParams {
  page?: string;
  limit?: string;
  cuisine?: string;
  priceRange?: string;
  city?: string;
  features?: string;
  search?: string;
  rating?: string;
}

export const getRestaurants = async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '12');
    const skip = (page - 1) * limit;

    const query: any = {};

    if (req.query.cuisine) {
      query.cuisine = req.query.cuisine;
    }

    if (req.query.priceRange) {
      query.priceRange = req.query.priceRange;
    }

    if (req.query.city) {
      query['location.city'] = new RegExp(req.query.city, 'i');
    }

    if (req.query.features) {
      const features = req.query.features.split(',');
      query.features = { $in: features };
    }

    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
        { cuisine: new RegExp(req.query.search, 'i') },
      ];
    }

    if (req.query.rating) {
      query.rating = { $gte: parseFloat(req.query.rating) };
    }

    const restaurants = await Restaurant.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      data: {
        restaurants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurants',
    });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    res.json({
      success: true,
      data: { restaurant },
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching restaurant',
    });
  }
};

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
      });
    }

    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: { restaurant },
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating restaurant',
    });
  }
};

export const searchNearby = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const restaurants = await Restaurant.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude as string), parseFloat(latitude as string)],
          },
          $maxDistance: parseFloat(radius as string) * 1000, // Convert to meters
        },
      },
    }).limit(20);

    res.json({
      success: true,
      data: { restaurants },
    });
  } catch (error) {
    console.error('Search nearby error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching nearby restaurants',
    });
  }
};

export const getFilterOptions = async (req: Request, res: Response) => {
  try {
    const [cuisines, cities, features] = await Promise.all([
      Restaurant.distinct('cuisine'),
      Restaurant.distinct('location.city'),
      Restaurant.distinct('features'),
    ]);

    const priceRanges = ['budget', 'mid-range', 'fine-dining'];

    res.json({
      success: true,
      data: {
        cuisines: cuisines.sort(),
        cities: cities.sort(),
        features: features.flat().sort(),
        priceRanges,
      },
    });
  } catch (error) {
    console.error('Get filter options error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching filter options',
    });
  }
};