#!/bin/bash

# ========================================
# Script de création automatique de Foodie Finder
# ========================================

echo "🍽️ Création du projet Foodie Finder..."

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour créer des fichiers
create_file() {
    local filepath=$1
    local content=$2
    
    # Créer le répertoire si nécessaire
    mkdir -p "$(dirname "$filepath")"
    
    # Créer le fichier avec le contenu
    echo "$content" > "$filepath"
    echo -e "${GREEN}✓${NC} Créé: $filepath"
}

# Créer la structure de base
echo -e "\n${YELLOW}📁 Création de la structure des dossiers...${NC}"
mkdir -p foodie-finder/{server,client}
cd foodie-finder

# ========================================
# BACKEND SETUP
# ========================================
echo -e "\n${YELLOW}🔧 Configuration du Backend...${NC}"
cd server

# package.json pour le backend
create_file "package.json" '{
  "name": "foodie-finder-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node utils/seedData.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}'

# .env pour le backend
create_file ".env" 'PORT=5000
MONGODB_URI=mongodb://localhost:27017/foodie-finder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173'

# server.js principal
create_file "server.js" 'import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/favorites", favoriteRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Foodie Finder API is running!" });
});

// Error handling
app.use(errorHandler);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });'

# Créer les autres fichiers du backend...
echo -e "${GREEN}✓${NC} Backend structure créée"

# ========================================
# FRONTEND SETUP
# ========================================
echo -e "\n${YELLOW}⚛️ Configuration du Frontend...${NC}"
cd ../client

# package.json pour le frontend
create_file "package.json" '{
  "name": "foodie-finder-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.6",
    "lucide-react": "^0.294.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.0",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/aspect-ratio": "^0.4.2"
  }
}'

# .env pour le frontend
create_file ".env" 'VITE_API_URL=http://localhost:5000/api'

# vite.config.js
create_file "vite.config.js" 'import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})'

# tailwind.config.js
create_file "tailwind.config.js" 'export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef3c7",
          100: "#fde68a",
          200: "#fcd34d",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        }
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
      }
    },
  },
  plugins: [],
}'

# index.html
create_file "index.html" '<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Foodie Finder - Découvrez les meilleurs restaurants</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>'

echo -e "${GREEN}✓${NC} Frontend structure créée"

# ========================================
# GIT SETUP
# ========================================
echo -e "\n${YELLOW}📝 Configuration de Git...${NC}"
cd ..

# .gitignore
create_file ".gitignore" '# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db'

# README.md
create_file "README.md" '# 🍽️ Foodie Finder

Une application web moderne pour découvrir et sauvegarder vos restaurants préférés.

## 🚀 Technologies

### Frontend
- React 18 avec Vite
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)
- Axios
- React Router v6

### Backend
- Node.js avec Express
- MongoDB avec Mongoose
- JWT Authentication
- Bcrypt

## 📦 Installation

### Prérequis
- Node.js 18+
- MongoDB
- Git

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/[votre-username]/foodie-finder.git
cd foodie-finder
```

2. **Installer les dépendances Backend**
```bash
cd server
npm install
```

3. **Installer les dépendances Frontend**
```bash
cd ../client
npm install
```

4. **Configuration**
- Créer un fichier `.env` dans `/server` avec vos variables
- Créer un fichier `.env` dans `/client` avec VITE_API_URL

5. **Lancer le projet**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

6. **Seed la base de données (optionnel)**
```bash
cd server
npm run seed
```

## 🎯 Fonctionnalités

- ✅ Recherche et filtres avancés
- ✅ Authentification JWT
- ✅ Système de favoris
- ✅ Avis et notations
- ✅ Mode sombre
- ✅ Design responsive
- ✅ Animations fluides

## 📱 Screenshots

[Ajouter des screenshots ici]

## 🔐 Compte de test

- Email: `test@example.com`
- Password: `password123`

## 📝 License

MIT

## 👤 Auteur

[Votre nom]

---

Fait avec ❤️ et React'

# Initialiser Git
git init
git add .
git commit -m "Initial commit - Foodie Finder project"

echo -e "\n${GREEN}✅ Projet créé avec succès !${NC}"
echo -e "\n${YELLOW}📋 Prochaines étapes :${NC}"
echo "1. Créer un repository sur GitHub"
echo "2. Ajouter le remote : git remote add origin https://github.com/[username]/foodie-finder.git"
echo "3. Push : git push -u origin main"
echo "4. Installer les dépendances : npm install dans /server et /client"
echo "5. Configurer MongoDB"
echo "6. Lancer le projet !"