import express from 'express';
import { addToFavorites, removeFromFavorites, getFavorites } from '@/controllers/userController';
import { protect } from '@/middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/favorites', getFavorites);
router.post('/favorites/:restaurantId', addToFavorites);
router.delete('/favorites/:restaurantId', removeFromFavorites);

export default router;