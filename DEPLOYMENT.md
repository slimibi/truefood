# 🚀 Deployment Guide - Foodie Finder

This guide covers deploying the Foodie Finder application to various platforms.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Build process works locally
- [ ] All tests passing
- [ ] Security configurations reviewed
- [ ] Performance optimizations applied

## 🗄 Database Deployment (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Sandbox for free tier)
4. Wait for cluster creation (2-3 minutes)

### 2. Configure Database Access

1. **Database Access**:
   - Go to Database Access
   - Click "Add New Database User"
   - Create username/password
   - Grant "Atlas admin" privileges

2. **Network Access**:
   - Go to Network Access
   - Click "Add IP Address"
   - Add "0.0.0.0/0" (Allow access from anywhere) for now
   - Later, restrict to your application's IPs

### 3. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `foodie-finder`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/foodie-finder?retryWrites=true&w=majority
```

### 4. Seed Production Database

```bash
# Set production MongoDB URI
export MONGODB_URI="your-production-connection-string"

# Run seed script
cd backend
npm run seed
```

## 🖥 Backend Deployment

### Option 1: Railway (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   railway init
   railway up
   ```

3. **Set Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set PORT=5000
   railway variables set MONGODB_URI="your-mongodb-atlas-uri"
   railway variables set JWT_SECRET="your-jwt-secret"
   railway variables set JWT_EXPIRES_IN=7d
   railway variables set CORS_ORIGIN="https://your-frontend-domain.com"
   ```

4. **Custom Start Script**:
   Create `railway.toml`:
   ```toml
   [build]
   builder = "nixpacks"
   
   [deploy]
   startCommand = "npm run build && npm start"
   ```

### Option 2: Heroku

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Windows/Linux
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login and Create App**:
   ```bash
   heroku login
   cd backend
   heroku create your-app-name-backend
   ```

3. **Set Environment Variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI="your-mongodb-atlas-uri"
   heroku config:set JWT_SECRET="your-jwt-secret"
   heroku config:set JWT_EXPIRES_IN=7d
   heroku config:set CORS_ORIGIN="https://your-frontend-domain.com"
   ```

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Connect Repository**:
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select the backend folder

2. **Configure Build**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment Variables: Add all production variables

3. **Deploy**:
   - Click "Create Resources"
   - Wait for deployment

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add VITE_API_URL production
   # Enter: https://your-backend-domain.com/api
   ```

4. **Custom Configuration** (`vercel.json`):
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Build and Deploy**:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir dist
   ```

3. **Set Environment Variables**:
   - Go to Netlify dashboard
   - Site settings > Environment variables
   - Add `VITE_API_URL` with your backend URL

4. **Configure Redirects** (`public/_redirects`):
   ```
   /*    /index.html   200
   ```

### Option 3: AWS S3 + CloudFront

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**:
   ```bash
   aws s3 mb s3://your-bucket-name
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Configure S3 for Static Hosting**:
   - Enable static website hosting
   - Set index document: `index.html`
   - Set error document: `index.html`

4. **Set Up CloudFront**:
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom error pages for SPA routing

## 🔧 Environment Variables Summary

### Backend Production Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.net/foodie-finder
JWT_SECRET=your-super-secure-64-character-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Production Variables
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🔒 Security Configuration

### 1. Update CORS Origins
```javascript
// backend/src/server.ts
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  credentials: true,
}));
```

### 2. Rate Limiting
```javascript
// Adjust rate limits for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 3. Environment-Specific Settings
```javascript
// backend/src/server.ts
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // trust first proxy
}
```

## 🚀 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Install frontend dependencies
        run: cd frontend && npm install
      
      - name: Build frontend
        run: cd frontend && npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway login --token ${{ secrets.RAILWAY_TOKEN }}
          cd backend && railway up

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          cd frontend && vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 📊 Monitoring and Logging

### 1. Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **New Relic**: Application performance monitoring

### 2. Uptime Monitoring
- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring features
- **StatusPage**: Status page for users

### 3. Analytics
- **Google Analytics**: User behavior tracking
- **Mixpanel**: Event tracking and analytics
- **Plausible**: Privacy-friendly analytics

## 🔧 Performance Optimization

### Backend Optimizations
```javascript
// Compression middleware
app.use(compression());

// Cache static assets
app.use(express.static('public', {
  maxAge: '1d',
  etag: false
}));

// Database connection pooling
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### Frontend Optimizations
```javascript
// Vite config optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

## 🛠 Troubleshooting Deployment Issues

### Common Backend Issues

1. **Port Issues**:
   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, '0.0.0.0', () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. **Database Connection**:
   ```javascript
   // Add connection options for production
   mongoose.connect(MONGODB_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 5000
   });
   ```

3. **CORS Errors**:
   ```javascript
   // Allow multiple origins
   const allowedOrigins = [
     'https://yoursite.com',
     'https://www.yoursite.com'
   ];
   ```

### Common Frontend Issues

1. **Routing Issues**:
   - Ensure `_redirects` file for Netlify
   - Configure proper rewrites for Vercel
   - Set up CloudFront error pages for AWS

2. **Environment Variables**:
   - Prefix with `VITE_` for Vite
   - Rebuild after changing variables
   - Check build logs for missing variables

3. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are installed
   - Review build error logs

## 📱 Domain Configuration

### Custom Domain Setup

1. **Purchase Domain**: Use providers like Namecheap, GoDaddy, or Google Domains

2. **Configure DNS**:
   ```
   # For Vercel
   CNAME www your-project.vercel.app
   A @ 76.76.19.61
   
   # For Netlify
   CNAME www your-site.netlify.app
   A @ 104.198.14.52
   ```

3. **SSL Certificate**: Most platforms provide automatic SSL

### Subdomain Structure
- `api.yourdomain.com` → Backend
- `yourdomain.com` → Frontend
- `admin.yourdomain.com` → Admin panel (future)

---

**Your Foodie Finder application is now ready for production! 🎉**