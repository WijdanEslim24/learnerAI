# Environment Configuration for Production Deployment

## Frontend Environment Variables (Vercel)
Create these in your Vercel dashboard under Settings > Environment Variables:

```
VITE_API_URL=https://your-backend-domain.railway.app
```

## Backend Environment Variables (Railway)
Create these in your Railway dashboard under Variables:

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
```

## GitHub Secrets
Add these to your GitHub repository under Settings > Secrets and Variables > Actions:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
RAILWAY_TOKEN=your_railway_token
```

## Supabase Configuration
1. Create a new Supabase project
2. Run the database schema: `database/schema.sql`
3. Seed with sample data: `database/seed.sql`
4. Get your project URL and API keys from Settings > API

## Deployment Steps

### 1. Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variables
5. Deploy!

### 2. Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables
5. Deploy!

### 3. Database (Supabase)
1. Create new Supabase project
2. Run schema and seed scripts
3. Update backend environment variables with Supabase credentials

### 4. CI/CD (GitHub Actions)
1. Add GitHub secrets
2. Push to main branch to trigger deployment
3. Monitor deployment status in Actions tab

## Production URLs
After deployment, you'll get:
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-app-name.railway.app`
- Database: `https://your-project.supabase.co`
