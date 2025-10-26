# Railway Deployment Guide - LearnerAI Backend

## Quick Deploy to Railway

The easiest way to deploy to Railway is to connect your GitHub repository directly in the Railway dashboard.

---

## Step 1: Create Railway Account & Project

1. Go to https://railway.app
2. Sign up with your GitHub account
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your `learnerAI` repository
6. Railway will automatically detect the backend directory

---

## Step 2: Configure the Service

Railway will auto-detect Node.js and run from the backend directory.

**Auto-detected settings:**
- Build Command: `npm install` (in backend folder)
- Start Command: `npm start` (in backend folder)
- Root Directory: `backend`

---

## Step 3: Add Environment Variables

In Railway Dashboard → Your Service → Variables tab, add:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Supabase Database
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# CORS Configuration
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Step 4: Get Supabase Credentials

1. Go to https://supabase.com
2. Create new project (or use existing)
3. Go to Settings → API
4. Copy:
   - Project URL → `SUPABASE_URL`
   - anon public → `SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 5: Deploy Database

1. Go to Supabase Dashboard → SQL Editor
2. Run the schema: Copy contents of `database/schema.sql`
3. Run the seed data: Copy contents of `database/seed.sql` (optional)

---

## Step 6: Deploy & Monitor

1. Railway will automatically deploy on push to main
2. Go to your service dashboard
3. Click "View Logs" to see deployment progress
4. Once deployed, Railway will provide a public URL like:
   ```
   https://learner-ai-backend-production.up.railway.app
   ```

---

## Step 7: Configure Frontend to Use Railway URL

1. Go to Vercel Dashboard
2. Select your project → Settings → Environment Variables
3. Add or update:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
4. Redeploy frontend

---

## Troubleshooting

### Issue: Build fails
**Check**: Logs in Railway dashboard  
**Fix**: Verify environment variables are set

### Issue: Service won't start
**Check**: Logs for error messages  
**Fix**: Usually missing `SUPABASE_URL` or `SUPABASE_ANON_KEY`

### Issue: Can't connect to database
**Check**: Supabase credentials are correct  
**Fix**: Test connection in Supabase dashboard first

### Issue: Health check fails
**Check**: `/health` endpoint is responding  
**Fix**: Ensure PORT environment variable is set

---

## Manual Deployment via Railway CLI

If you prefer CLI deployment:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
cd backend
railway link

# Deploy
railway up
```

---

## Environment Variables Reference

### Required Variables
```bash
SUPABASE_URL=              # Your Supabase project URL
SUPABASE_ANON_KEY=         # Your Supabase anon key
NODE_ENV=production        # Production environment
PORT=5000                   # Server port (Railway auto-assigns)
```

### Optional Variables
```bash
FRONTEND_URL=              # Allowed CORS origin
SUPABASE_SERVICE_ROLE_KEY= # For admin operations
JWT_SECRET=                # For authentication
LOG_LEVEL=                 # info, debug, error
```

---

## Deployment Checklist

- [ ] Railway project created
- [ ] GitHub repository connected
- [ ] Service configured for backend directory
- [ ] Environment variables set
- [ ] Supabase database created and seeded
- [ ] Service deployed and running
- [ ] Public URL obtained
- [ ] Health endpoint responding (`/health`)
- [ ] Frontend connected to Railway URL

---

## Quick Commands

### View Logs
```bash
railway logs
```

### Connect to Service
```bash
railway connect
```

### Check Status
```bash
railway status
```

### Open in Browser
```bash
railway open
```

---

## Next Steps After Deployment

1. **Test Backend**
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Update Frontend**
   - Set `VITE_API_URL` in Vercel
   - Redeploy frontend

3. **Monitor**
   - Check Railway logs
   - Monitor Railway metrics
   - Set up alerts (optional)

4. **Optional: Custom Domain**
   - Add domain in Railway dashboard
   - Configure DNS records

---

## Cost Information

Railway offers:
- **Free tier**: 500 hours/month
- **Hobby**: $5/month for 1440 hours
- **Team**: $10/seat/month

For this project, free tier should be sufficient.

---

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Your Service: Railway Dashboard

---

**Ready to deploy?** Just connect your repo to Railway and it will auto-deploy on push to main! 🚀
