import { Request, Response } from 'express';
import User, { IUser } from '@/models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.favorites.includes(restaurantId as any)) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant already in favorites',
      });
    }

    user.favorites.push(restaurantId as any);
    await user.save();

    res.json({
      success: true,
      message: 'Restaurant added to favorites',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding to favorites',
    });
  }
};

export const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const userId = req.user!._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== restaurantId
    );
    await user.save();

    res.json({
      success: true,
      message: 'Restaurant removed from favorites',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing from favorites',
    });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).populate('favorites');
    
    res.json({
      success: true,
      data: { favorites: user!.favorites },
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching favorites',
    });
  }
};