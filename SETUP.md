# 🚀 Complete Setup Guide - Foodie Finder

This guide will walk you through setting up the Foodie Finder application from scratch on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **MongoDB** (v5.0.0 or higher)
  - Option 1: Install locally from https://www.mongodb.com/try/download/community
  - Option 2: Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
  - Option 3: Use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
- **Git**
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

### Optional but Recommended
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing tool
- **VS Code** - Code editor with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Bracket Pair Colorizer

## 🛠 Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/foodie-finder.git

# Navigate to project directory
cd foodie-finder

# Check the project structure
ls -la
```

You should see:
```
backend/
frontend/
docs/
README.md
SETUP.md
```

### Step 2: Backend Setup

#### 2.1 Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

#### 2.2 Setup Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file with your preferred editor
nano .env  # or code .env for VS Code
```

**Required Backend Environment Variables:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodie-finder
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: For production image uploads
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important Notes:**
- Replace `JWT_SECRET` with a secure random string (minimum 32 characters)
- If using MongoDB Atlas, update `MONGODB_URI` with your connection string
- Keep the default PORT (5000) for local development

#### 2.3 Generate a Secure JWT Secret

```bash
# Generate a random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use OpenSSL
openssl rand -base64 64
```

Copy the generated string and use it as your `JWT_SECRET` in the `.env` file.

### Step 3: Database Setup

#### Option A: Local MongoDB

```bash
# Start MongoDB service (Linux/macOS)
sudo systemctl start mongod

# Or start MongoDB daemon directly
mongod --dbpath /path/to/your/database/directory

# Verify MongoDB is running
mongo --eval "db.adminCommand('ismaster')"
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foodie-finder?retryWrites=true&w=majority
   ```

#### Option C: Docker

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=foodie-finder \
  mongo:latest

# Verify it's running
docker ps
```

### Step 4: Seed the Database

```bash
# Make sure you're in the backend directory
cd backend

# Build TypeScript code
npm run build

# Seed the database with sample restaurants
npm run seed
```

You should see output like:
```
🍃 MongoDB Connected: localhost:27017
🗑️ Existing restaurants cleared
✅ 6 restaurants seeded successfully
```

### Step 5: Start the Backend Server

```bash
# Start development server with hot reload
npm run dev
```

You should see:
```
🚀 Server running on port 5000 in development mode
🍃 MongoDB Connected: localhost:27017
```

**Test the API:**
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"Foodie Finder API is running!"}
```

### Step 6: Frontend Setup

#### 6.1 Install Frontend Dependencies

Open a new terminal window/tab and navigate to the frontend directory:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

#### 6.2 Setup Frontend Environment Variables

```bash
# Create environment file
touch .env

# Add environment variables
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

**Frontend Environment Variables:**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 7: Start the Frontend Development Server

```bash
# Make sure you're in the frontend directory
cd frontend

# Start development server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 8: Verify Everything is Working

1. **Open your browser** and go to: http://localhost:3000
2. **Check the homepage** loads correctly
3. **Test navigation** to different pages
4. **Try the search functionality**
5. **Create a user account** and test login/logout

## 🧪 Testing Your Setup

### Backend Testing

```bash
# In backend directory
cd backend

# Test health endpoint
curl http://localhost:5000/api/health

# Test restaurants endpoint
curl http://localhost:5000/api/restaurants

# Test filter options endpoint
curl http://localhost:5000/api/restaurants/filter-options
```

### Frontend Testing

1. **Homepage**: Should display featured restaurants
2. **Restaurants Page**: Should show restaurant grid with filters
3. **Search**: Try searching for "pizza" or filtering by cuisine
4. **Dark Mode**: Toggle the theme switcher
5. **Responsive Design**: Resize browser window to test mobile view

## 🐛 Troubleshooting

### Common Issues and Solutions

#### "Connection failed to MongoDB"
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

#### "Port 5000 already in use"
```bash
# Find process using port 5000
lsof -ti:5000

# Kill the process
kill -9 $(lsof -ti:5000)

# Or use a different port in backend/.env
PORT=5001
```

#### "Cannot connect to backend API"
1. Verify backend is running on port 5000
2. Check `VITE_API_URL` in frontend/.env
3. Ensure no firewall blocking the connection
4. Try accessing http://localhost:5000/api/health directly

#### "JWT Secret Error"
- Ensure `JWT_SECRET` is at least 32 characters long
- Use only alphanumeric characters and symbols
- Restart backend server after changing JWT_SECRET

#### "Database connection timeout"
- Check MongoDB connection string
- Verify network connectivity
- For Atlas: Check IP whitelist settings

### Reset Everything

If you need to start fresh:

```bash
# Stop all servers (Ctrl+C)

# Backend cleanup
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend cleanup
cd ../frontend
rm -rf node_modules package-lock.json
npm install

# Clear database (optional)
mongo foodie-finder --eval "db.dropDatabase()"

# Re-seed database
cd ../backend
npm run seed
```

## 🚀 Production Considerations

### Environment Variables for Production
- Use strong, unique `JWT_SECRET`
- Set `NODE_ENV=production`
- Use production MongoDB instance
- Configure proper CORS origins
- Set up rate limiting appropriately

### Security Checklist
- [ ] Strong JWT secret (64+ characters)
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation active
- [ ] CORS properly configured
- [ ] Sensitive data in environment variables
- [ ] Database access restricted

### Performance Optimization
- [ ] Enable compression middleware
- [ ] Configure proper caching headers
- [ ] Optimize database queries
- [ ] Use CDN for static assets
- [ ] Enable gzip compression

## 📞 Getting Help

If you encounter issues:

1. **Check the logs**: Look at terminal output for error messages
2. **Review this guide**: Make sure you followed all steps
3. **Check GitHub Issues**: Search for similar problems
4. **Create an issue**: Include error logs and system information

### System Information Template
```bash
# When reporting issues, include:
node --version
npm --version
mongo --version  # or mongod --version
git --version
```

---

**Congratulations! 🎉 You now have a fully functional Foodie Finder application running locally.**