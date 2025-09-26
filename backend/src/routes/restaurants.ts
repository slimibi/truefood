import express from 'express';
import { body } from 'express-validator';
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  searchNearby,
  getFilterOptions,
} from '@/controllers/restaurantController';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/filter-options', getFilterOptions);
router.get('/nearby', searchNearby);
router.get('/:id', getRestaurant);

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    body('cuisine').notEmpty().withMessage('Cuisine type is required'),
    body('priceRange').isIn(['budget', 'mid-range', 'fine-dining']).withMessage('Invalid price range'),
    body('location.address').notEmpty().withMessage('Address is required'),
    body('location.city').notEmpty().withMessage('City is required'),
    body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  ],
  createRestaurant
);

export default router;