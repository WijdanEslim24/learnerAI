#!/bin/bash

# LearnerAI Setup Script
echo "🚀 Setting up LearnerAI project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "✅ All dependencies installed successfully!"

# Check for environment files
echo "🔧 Checking environment configuration..."

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Copying from example..."
    cp frontend/env.example frontend/.env
    echo "📝 Please edit frontend/.env with your configuration"
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Copying from example..."
    cp backend/env.example backend/.env
    echo "📝 Please edit backend/.env with your configuration"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project and run database/schema.sql"
echo "2. Configure environment variables in frontend/.env and backend/.env"
echo "3. Run 'npm run dev' to start development servers"
echo ""
echo "📚 For detailed setup instructions, see docs/README.md"
