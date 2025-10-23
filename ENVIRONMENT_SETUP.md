# LearnerAI Production Environment Variables

## Required Environment Variables

### Frontend (Vercel)
- `VITE_API_URL`: Your Railway backend URL (e.g., https://learner-ai-backend.railway.app)

### Backend (Railway)
- `NODE_ENV`: production
- `PORT`: 5000
- `FRONTEND_URL`: Your Vercel frontend URL (e.g., https://learner-ai-frontend.vercel.app)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A secure random string for JWT tokens

### Database (Supabase)
Run these SQL scripts in your Supabase SQL editor:
1. `database/schema.sql` - Creates all tables
2. `database/seed.sql` - Inserts sample data

## Quick Setup Commands

### 1. Create Supabase Project
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project
supabase init

# Start local development
supabase start

# Get your project URL and keys from the output
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

### 3. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd backend
railway up
```

## Security Checklist
- [ ] Use strong JWT secrets
- [ ] Enable CORS for production domains only
- [ ] Set up Supabase Row Level Security (RLS)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only
- [ ] Set up proper error handling and logging
