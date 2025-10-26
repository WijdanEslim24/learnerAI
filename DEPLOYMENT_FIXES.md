# Deployment Issues Fixed

## Issues Identified and Fixed

### ✅ Issue 1: Invalid Vercel Configuration
**Problem**: `vercel.json` had incorrect build configuration  
**Fixed**: Updated to proper Vercel format with correct build commands

**Before:**
```json
{
  "version": 2,
  "name": "learner-ai-frontend",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"
    }
  ]
}
```

**After:**
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite"
}
```

---

### ✅ Issue 2: Invalid Railway Configuration
**Problem**: `railway.json` was a text file, not JSON  
**Fixed**: Converted to proper Railway JSON schema

**Before:**
```
# Build command
build: "cd backend && npm install"
```

**After:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/health"
  }
}
```

---

### ✅ Issue 3: Missing Backend Build Script
**Problem**: Backend package.json had no "build" script  
**Fixed**: Added build script

**Added to backend/package.json:**
```json
"build": "echo 'Backend build complete'"
```

---

## Common Deployment Issues

### Issue: Environment Variables Missing
**Symptom**: App crashes on startup  
**Solution**: Ensure all environment variables are set:

#### Vercel (Frontend)
```bash
VITE_API_URL=https://your-backend.railway.app
```

#### Railway (Backend)
```bash
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Issue: GitHub Secrets Not Configured
**Symptom**: CI/CD pipeline fails with authentication errors  
**Solution**: Add these secrets to GitHub:

Go to: Settings > Secrets and Variables > Actions

Required secrets:
```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
RAILWAY_TOKEN=your_railway_token
```

---

### Issue: Supabase Database Not Configured
**Symptom**: Backend fails to connect to database  
**Solution**: 

1. Create Supabase project at https://supabase.com
2. Run schema script: `database/schema.sql`
3. Seed with sample data: `database/seed.sql`
4. Get credentials from Settings > API
5. Add to Railway environment variables

---

## Deployment Steps (Updated)

### 1. Frontend on Vercel

#### Option A: Manual Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL
6. Click "Deploy"

#### Option B: Via GitHub Actions
1. Add GitHub secrets (see above)
2. Push to `main` branch
3. Check Actions tab for deployment status

---

### 2. Backend on Railway

#### Option A: Manual Deployment
1. Go to [railway.app](https://railway.app)
2. Click "New Project" > "Deploy from GitHub repo"
3. Select your repository
4. Add service and select "Backend"
5. Set environment variables:
   ```bash
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=your-frontend-url
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-key
   ```
6. Click "Deploy"

#### Option B: Via GitHub Actions
1. Add `RAILWAY_TOKEN` to GitHub secrets
2. Push to `main` branch
3. Check Railway dashboard for deployment status

---

### 3. Database on Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run `database/schema.sql`
5. Run `database/seed.sql` (optional)
6. Get credentials from Settings > API
7. Add to Railway environment variables

---

## Testing Deployment

### Test Frontend
```bash
curl https://your-app.vercel.app
```

### Test Backend
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## Troubleshooting

### Backend Won't Start
**Check:**
1. Environment variables are set
2. Supabase connection is working
3. Port is correct (Railway auto-assigns)
4. Logs in Railway dashboard

### Frontend Can't Connect to Backend
**Check:**
1. `VITE_API_URL` is correct in Vercel
2. Backend URL is reachable
3. CORS is configured in backend
4. Rebuild frontend after changing env vars

### GitHub Actions Failing
**Check:**
1. All secrets are added
2. Secrets have correct values
3. Permissions are correct
4. Check Actions tab for error details

---

## Quick Deploy Commands

### Test Locally First
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Deploy with One Command
```bash
# Create a deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
echo "Deploying to production..."

# Set production environment
export NODE_ENV=production

# Build backend
cd backend && npm install && npm run build && cd ..

# Build frontend
cd frontend && npm install && npm run build && cd ..

echo "Build complete. Ready for deployment."
EOF

chmod +x deploy.sh
./deploy.sh
```

---

## Next Steps

1. ✅ Fixed configuration files
2. ⬜ Set up Vercel deployment
3. ⬜ Set up Railway deployment
4. ⬜ Configure Supabase database
5. ⬜ Add GitHub secrets
6. ⬜ Test end-to-end deployment
7. ⬜ Monitor production logs

---

## Need Help?

### Check Logs
- **Vercel**: Dashboard > Your Project > Deployments > View Logs
- **Railway**: Dashboard > Your Service > View Logs
- **GitHub**: Repository > Actions > Select workflow > View logs

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing Supabase configuration" | Env vars not set | Add SUPABASE_URL and SUPABASE_ANON_KEY |
| "Failed to fetch" | CORS issue | Check CORS config in backend |
| "Module not found" | Dependencies not installed | Run npm install in correct directory |
| "Port already in use" | Another service using port | Use Railway's auto-assigned port |
| "Build failed" | Invalid configuration | Check build logs for specific error |

---

## Success Checklist

- [ ] Vercel configuration updated
- [ ] Railway configuration updated
- [ ] Backend build script added
- [ ] Environment variables configured
- [ ] GitHub secrets added
- [ ] Supabase database created
- [ ] Frontend deployed successfully
- [ ] Backend deployed successfully
- [ ] Health endpoint responding
- [ ] Frontend can connect to backend
