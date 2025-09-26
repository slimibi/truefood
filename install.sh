#!/bin/bash

# Foodie Finder - Quick Installation Script
# This script automates the setup process for the Foodie Finder application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    header "🔍 Checking prerequisites..."
    
    # Check Node.js
    if command_exists node; then
        NODE_VERSION=$(node --version)
        log "Node.js found: $NODE_VERSION"
        
        # Check if version is >= 18
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
        if [ "$NODE_MAJOR" -lt 18 ]; then
            error "Node.js version 18 or higher is required. Please update Node.js."
            exit 1
        fi
    else
        error "Node.js is not installed. Please install Node.js 18 or higher."
        echo "Download from: https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if command_exists npm; then
        NPM_VERSION=$(npm --version)
        log "npm found: $NPM_VERSION"
    else
        error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check MongoDB (optional - can use Atlas)
    if command_exists mongod; then
        log "MongoDB found locally"
        MONGODB_LOCAL=true
    else
        warn "MongoDB not found locally. You'll need to use MongoDB Atlas or install MongoDB."
        MONGODB_LOCAL=false
    fi
    
    # Check Git
    if command_exists git; then
        log "Git found"
    else
        error "Git is not installed. Please install Git."
        exit 1
    fi
    
    log "✅ Prerequisites check completed"
    echo
}

# Install dependencies
install_dependencies() {
    header "📦 Installing dependencies..."
    
    # Install root dependencies
    if [ -f package.json ]; then
        log "Installing root dependencies..."
        npm install
    fi
    
    # Install backend dependencies
    log "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install frontend dependencies
    log "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    log "✅ Dependencies installed successfully"
    echo
}

# Setup environment variables
setup_environment() {
    header "🔧 Setting up environment variables..."
    
    # Backend environment
    if [ ! -f backend/.env ]; then
        log "Creating backend .env file..."
        cp backend/.env.example backend/.env
        
        # Generate JWT secret
        JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
        
        # Update .env file
        sed -i.bak "s/your-super-secret-jwt-key-here-change-in-production/$JWT_SECRET/" backend/.env
        
        log "✅ Backend .env file created with generated JWT secret"
    else
        warn "Backend .env file already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f frontend/.env ]; then
        log "Creating frontend .env file..."
        echo "VITE_API_URL=http://localhost:5000/api" > frontend/.env
        log "✅ Frontend .env file created"
    else
        warn "Frontend .env file already exists, skipping..."
    fi
    
    echo
}

# Setup database
setup_database() {
    header "🗄 Setting up database..."
    
    if [ "$MONGODB_LOCAL" = true ]; then
        # Check if MongoDB is running
        if pgrep -x "mongod" > /dev/null; then
            log "MongoDB is already running"
        else
            log "Starting MongoDB..."
            # Try to start MongoDB service
            if command_exists systemctl; then
                sudo systemctl start mongod 2>/dev/null || warn "Could not start MongoDB service. Please start it manually."
            else
                warn "Please start MongoDB manually: mongod"
            fi
        fi
    else
        warn "Local MongoDB not found. Please either:"
        echo "  1. Install MongoDB locally, or"
        echo "  2. Set up MongoDB Atlas and update MONGODB_URI in backend/.env"
        echo "  3. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo:latest"
        echo
        read -p "Press Enter to continue after setting up MongoDB..."
    fi
    
    # Seed database
    log "Building backend and seeding database..."
    cd backend
    npm run build
    npm run seed
    cd ..
    
    log "✅ Database setup completed"
    echo
}

# Start development servers
start_servers() {
    header "🚀 Starting development servers..."
    
    log "This will start both backend and frontend servers."
    log "Backend will run on: http://localhost:5000"
    log "Frontend will run on: http://localhost:3000"
    echo
    log "Press Ctrl+C to stop the servers"
    echo
    
    read -p "Press Enter to start the servers..."
    
    # Start both servers using concurrently (if available) or manually
    if [ -f package.json ] && npm list concurrently > /dev/null 2>&1; then
        npm run dev
    else
        warn "Starting servers manually. You'll need to open two terminals:"
        echo "Terminal 1: cd backend && npm run dev"
        echo "Terminal 2: cd frontend && npm run dev"
        
        read -p "Start backend server now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cd backend
            npm run dev &
            BACKEND_PID=$!
            cd ..
            
            log "Backend started with PID: $BACKEND_PID"
            log "Now start the frontend in another terminal: cd frontend && npm run dev"
        fi
    fi
}

# Display final instructions
display_instructions() {
    header "🎉 Installation completed successfully!"
    echo
    log "Your Foodie Finder application is ready!"
    echo
    echo "📍 Next steps:"
    echo "1. Open http://localhost:3000 in your browser"
    echo "2. Test the application features"
    echo "3. Create a user account and try the favorites feature"
    echo "4. Explore restaurants and use the search/filter functionality"
    echo
    echo "📚 Documentation:"
    echo "• README.md - Overview and features"
    echo "• SETUP.md - Detailed setup guide"
    echo "• DEPLOYMENT.md - Production deployment guide"
    echo
    echo "🛠 Development commands:"
    echo "• npm run dev - Start both servers"
    echo "• npm run dev:backend - Start backend only"
    echo "• npm run dev:frontend - Start frontend only"
    echo "• npm run build - Build for production"
    echo "• npm run seed - Reseed database"
    echo
    echo "❓ Need help? Check the documentation or create an issue on GitHub."
    echo
    log "Happy coding! 🍽️✨"
}

# Main installation process
main() {
    clear
    header "🍽️  Foodie Finder - Installation Script"
    header "======================================"
    echo
    
    log "This script will set up the Foodie Finder application on your machine."
    echo
    read -p "Press Enter to continue..."
    echo
    
    check_prerequisites
    install_dependencies
    setup_environment
    setup_database
    
    echo
    read -p "Do you want to start the development servers now? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_servers
    else
        display_instructions
    fi
}

# Run main function
main "$@"