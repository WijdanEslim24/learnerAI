@echo off
REM LearnerAI Setup Script for Windows

echo 🚀 Setting up LearnerAI project...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
npm install
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
cd ..

echo ✅ All dependencies installed successfully!

REM Check for environment files
echo 🔧 Checking environment configuration...

if not exist "frontend\.env" (
    echo ⚠️  Frontend .env file not found. Copying from example...
    copy frontend\env.example frontend\.env
    echo 📝 Please edit frontend\.env with your configuration
)

if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Copying from example...
    copy backend\env.example backend\.env
    echo 📝 Please edit backend\.env with your configuration
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Set up your Supabase project and run database\schema.sql
echo 2. Configure environment variables in frontend\.env and backend\.env
echo 3. Run 'npm run dev' to start development servers
echo.
echo 📚 For detailed setup instructions, see docs\README.md
pause
