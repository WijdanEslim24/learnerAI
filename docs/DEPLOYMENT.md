# LearnerAI Deployment Guide

## Overview
This guide covers deploying LearnerAI to production using Vercel (frontend), Railway (backend), and Supabase (database).

## Prerequisites
- GitHub repository with LearnerAI code
- Vercel account
- Railway account
- Supabase account
- OpenAI API key

## Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `backend/database/schema.sql`
3. Execute the SQL script
4. Verify tables are created

### 3. Configure Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
CREATE POLICY "Allow all operations for authenticated users" ON workers
FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON learning_paths
FOR ALL USING (auth.role() = 'authenticated');
```

## Backend Deployment (Railway)

### 1. Connect Repository
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your LearnerAI repository

### 2. Configure Environment Variables
In Railway dashboard, add these environment variables:

```bash
NODE_ENV=production
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=https://your-vercel-app.vercel.app
LOG_LEVEL=info
AI_SERVICE_URL=https://your-ai-service-url
AI_API_KEY=your_openai_api_key
```

### 3. Configure Build Settings
Railway should auto-detect Node.js. If not, add:
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`

### 4. Deploy
1. Railway will automatically deploy on push to main branch
2. Note the generated URL (e.g., `https://learner-ai-backend.railway.app`)

## Frontend Deployment (Vercel)

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory

### 2. Configure Environment Variables
In Vercel dashboard, add these environment variables:

```bash
VITE_API_URL=https://your-railway-app.railway.app
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=LearnerAI
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true
```

### 3. Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy
1. Vercel will automatically deploy on push to main branch
2. Note the generated URL (e.g., `https://learner-ai.vercel.app`)

## CI/CD Pipeline Setup

### 1. GitHub Secrets
Add these secrets to your GitHub repository:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
RAILWAY_TOKEN=your_railway_token
```

### 2. Vercel Token
1. Go to Vercel dashboard → Settings → Tokens
2. Create a new token
3. Add to GitHub secrets as `VERCEL_TOKEN`

### 3. Railway Token
1. Go to Railway dashboard → Account → Tokens
2. Create a new token
3. Add to GitHub secrets as `RAILWAY_TOKEN`

### 4. Vercel Project IDs
1. Go to your Vercel project settings
2. Note the Organization ID and Project ID
3. Add to GitHub secrets

## Domain Configuration

### 1. Custom Domain (Optional)
- **Frontend**: Add custom domain in Vercel dashboard
- **Backend**: Add custom domain in Railway dashboard
- Update environment variables with new URLs

### 2. CORS Configuration
Update backend CORS settings:
```javascript
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://your-vercel-app.vercel.app'
  ],
  credentials: true
}))
```

## Monitoring and Logging

### 1. Railway Logs
- View logs in Railway dashboard
- Set up log aggregation if needed

### 2. Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics

### 3. Supabase Monitoring
- Monitor database performance in Supabase dashboard
- Set up alerts for high usage

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique API keys
- Rotate keys regularly

### 2. Database Security
- Enable RLS policies
- Use service role key only for server-side operations
- Monitor database access logs

### 3. API Security
- Implement rate limiting
- Use HTTPS everywhere
- Validate all inputs

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check environment variables are set correctly
- Verify Node.js version compatibility
- Review build logs for specific errors

#### 2. Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure database is accessible

#### 3. CORS Errors
- Update CORS configuration with correct frontend URL
- Check if frontend URL changed after deployment

#### 4. AI Service Issues
- Verify OpenAI API key is valid
- Check API rate limits
- Monitor AI service logs

### Debug Commands
```bash
# Check backend logs
railway logs

# Check frontend build
vercel logs

# Test database connection
psql $SUPABASE_URL

# Test API endpoints
curl https://your-railway-app.railway.app/health
```

## Production Checklist

- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] SSL certificates active
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Maintenance

### Regular Tasks
- Monitor application performance
- Review and rotate API keys
- Update dependencies
- Backup database
- Review security logs

### Updates
- Test updates in staging environment first
- Use feature flags for gradual rollouts
- Monitor error rates after deployments
- Have rollback plan ready
