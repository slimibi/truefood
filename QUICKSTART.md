# 🚀 Foodie Finder - Quick Start Guide

This guide gets you up and running with Foodie Finder in 5 minutes.

## ⚡ Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free) or install locally
- **Git** - [Download here](https://git-scm.com/)

## 🏃‍♂️ Quick Setup (Automated)

```bash
# 1. Clone and navigate
git clone <repository-url>
cd foodie-finder

# 2. Run the automated installer
chmod +x install.sh
./install.sh
```

The installer will:
- ✅ Install all dependencies
- ✅ Set up environment variables
- ✅ Generate secure JWT secrets
- ✅ Build the applications
- ✅ Seed sample data (if MongoDB available)
- ✅ Start both servers

## 📝 Manual Setup (Step-by-step)

### 1. Install Dependencies
```bash
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
cd frontend && npm install && cd ..
```

### 2. Environment Setup
```bash
# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
```

### 3. Configure Database

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `backend/.env`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Generate JWT Secret
```bash
# Generate secure secret
openssl rand -base64 64 | tr -d "=+/" | cut -c1-64

# Update JWT_SECRET in backend/.env with generated secret
```

### 5. Build & Start
```bash
# Build backend
cd backend && npm run build && cd ..

# Seed database (optional)
cd backend && npm run seed && cd ..

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)  
cd frontend && npm run dev
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 🛠 Development Commands

```bash
# Root level commands
npm run dev              # Start both servers
npm run build            # Build both applications  
npm run lint             # Lint both applications
npm run seed             # Seed database

# Backend commands
cd backend
npm run dev              # Start with hot reload
npm run build            # Build TypeScript
npm run seed             # Add sample restaurants
npm run lint             # Check code quality

# Frontend commands  
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check code quality
```

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📦 Production Deployment

### Backend (Railway/Heroku)
```bash
# Set environment variables in platform dashboard
NODE_ENV=production
MONGODB_URI=<your-atlas-uri>
JWT_SECRET=<64-char-secret>
CORS_ORIGIN=https://your-frontend-domain.com

# Deploy
npm run deploy:railway
```

### Frontend (Vercel/Netlify)
```bash
# Set environment variables
VITE_API_URL=https://your-backend-domain.com/api

# Deploy
npm run deploy:vercel
```

## 🔧 Troubleshooting

### "MongoDB connection failed"
- ✅ Check MongoDB is running
- ✅ Verify connection string in `.env`
- ✅ Check network/firewall settings

### "Port already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### "JWT Secret error"
- ✅ Ensure JWT_SECRET is at least 32 characters
- ✅ Restart backend server after changing

### "Build fails"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Explore Features**: Browse restaurants, use search/filters, create account
2. **Customize**: Modify colors in `tailwind.config.js`, add new features
3. **Deploy**: Follow `DEPLOYMENT.md` for production deployment
4. **Scale**: Add more restaurants, implement reviews, add payment system

## 🆘 Support

- 📖 Full documentation: `README.md` 
- 🔧 Detailed setup: `SETUP.md`
- 🚀 Deployment guide: `DEPLOYMENT.md`
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/foodie-finder/issues)

---

**Happy coding! 🍽️✨**