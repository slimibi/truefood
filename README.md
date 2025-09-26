# Foodie Finder

A modern, full-stack restaurant discovery application built with React, TypeScript, Node.js, Express, and MongoDB. Discover, filter, and save your favorite restaurants with a beautiful, responsive UI and powerful search capabilities.

![Foodie Finder](https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=300&fit=crop&crop=center)


##Here some screenshots : 
<img width="1919" height="1196" alt="Screenshot 2025-09-26 010455" src="https://github.com/user-attachments/assets/60b38d25-0401-4d5a-99f4-7b5bf3fe68cc" />

<img width="1919" height="1199" alt="Screenshot 2025-09-26 010503" src="https://github.com/user-attachments/assets/654a9eea-4992-45b6-ae08-e800e50452a6" />

<img width="1919" height="1199" alt="Screenshot 2025-09-26 010511" src="https://github.com/user-attachments/assets/8afc31bd-083f-43ca-b591-b0b6a1f50664" />

<img width="1919" height="1199" alt="Screenshot 2025-09-26 010516" src="https://github.com/user-attachments/assets/f5fb02d6-dfef-48fd-bf47-659df6ed223f" />

<img width="1919" height="1199" alt="Screenshot 2025-09-26 010521" src="https://github.com/user-attachments/assets/185fdfef-b922-4a3a-9d8f-4c2c451d47e9" />

<img width="1919" height="1199" alt="Screenshot 2025-09-26 010528" src="https://github.com/user-attachments/assets/7a90268e-5174-4752-90c1-68c7bd93b9d0" />

## Features

### Core Features
- **Restaurant Discovery**: Browse a curated collection of restaurants with detailed information
- **Smart Search & Filtering**: Search by name, cuisine, location, price range, features, and ratings
- **Detailed Restaurant Pages**: View comprehensive restaurant information, photos, hours, and contact details
- **Favorites System**: Save and manage your favorite restaurants (requires authentication)
- **Location-Based Search**: Find nearby restaurants using geolocation
- **Responsive Design**: Beautiful, modern UI that works on all devices

### UI/UX Features
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Modern Design**: Clean, professional interface built with Tailwind CSS
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Loading States**: Elegant loading indicators and skeleton screens
- **Toast Notifications**: User-friendly feedback for all actions
- **Mobile-First**: Optimized for mobile devices with touch-friendly interactions

### Authentication
- **User Registration & Login**: Secure JWT-based authentication
- **Profile Management**: Update user information and preferences
- **Protected Routes**: Secure access to user-specific features

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Modern React**: Hooks, Context, and functional components
- **State Management**: Zustand for lightweight, scalable state management
- **API Integration**: React Query for efficient data fetching and caching
- **Form Handling**: React Hook Form with validation
- **Error Boundaries**: Graceful error handling throughout the app

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foodie-finder.git
   cd foodie-finder
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   **Backend** (`backend/.env`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/foodie-finder
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   
   # Rate limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   
   # Optional: Cloudinary for image uploads
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # Using MongoDB service (Linux/macOS)
   sudo systemctl start mongod
   
   # Using MongoDB directly
   mongod --dbpath /path/to/your/db
   
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

6. **Seed the database with sample data**
   ```bash
   cd backend
   npm run seed
   ```

7. **Start the development servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

8. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/health

## Project Structure

```
foodie-finder/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB/Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.ts       # Express server setup
│   ├── tests/              # Backend tests
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React/TypeScript frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── layout/    # Layout components
│   │   │   └── features/  # Feature-specific components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand store
│   │   ├── styles/        # Global styles
│   │   ├── types/         # TypeScript definitions
│   │   ├── utils/         # Utility functions
│   │   └── App.tsx        # Main App component
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                  # Additional documentation
└── README.md             # This file
```

## Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run seed        # Seed database with sample data
npm test            # Run tests
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
```

### Frontend Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run type-check  # Run TypeScript type checking
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Restaurants
- `GET /api/restaurants` - Get restaurants with filters/search
- `GET /api/restaurants/:id` - Get single restaurant
- `GET /api/restaurants/filter-options` - Get available filter options
- `GET /api/restaurants/nearby` - Find nearby restaurants
- `POST /api/restaurants` - Create restaurant (admin only)

### User Management
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:id` - Add to favorites
- `DELETE /api/users/favorites/:id` - Remove from favorites

## Key Technologies

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling and validation
- **Lucide React** - Modern icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Express Validator** - Input validation

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Rate Limiting** - Prevent API abuse
- **CORS Configuration** - Secure cross-origin requests
- **Helmet** - Security headers
- **Input Validation** - Comprehensive input sanitization
- **Environment Variables** - Sensitive data protection

## Responsive Design

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## Dark Mode

- **System Preference Detection** - Automatically detects user's system theme
- **Manual Toggle** - Users can override with manual selection
- **Persistent Storage** - Theme preference saved locally
- **Smooth Transitions** - All theme changes are animated

## Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)
1. Set production environment variables
2. Build the TypeScript code: `npm run build`
3. Start with: `npm start`

### Frontend Deployment (Vercel/Netlify/AWS)
1. Set build command: `npm run build`
2. Set output directory: `dist`
3. Configure environment variables

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Update `MONGODB_URI` in backend environment variables
3. Whitelist your application's IP addresses



## Acknowledgments

- **Unsplash** - Beautiful restaurant photos
- **Lucide** - Modern icon set
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - Flexible document database

---
---

**Happy coding! 🍽️✨**
