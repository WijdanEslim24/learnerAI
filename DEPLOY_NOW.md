# Deploy LearnerAI - Step by Step

## Current Status ✅
- **Vercel Frontend**: Successfully deployed!
- **Railway Backend**: Needs configuration

---

## Step 1: Deploy Backend to Railway (5 minutes)

### Go to Railway
1. Visit: **https://railway.app**
2. Sign in with your GitHub account
3. Click **"New Project"**

### Connect Repository
4. Select **"Deploy from GitHub repo"**
5. Find and select your **`learnerAI`** repository
6. Railway will auto-detect it's a Node.js backend

### Configure the Service
7. Make sure it points to `backend` folder
8. Railway should auto-detect:
   - Build: `npm install`
   - Start: `npm start`

---

## Step 2: Set Environment Variables

### In Railway Dashboard:
Click on your service → **Variables** tab

Add these (one by one):

```bash
NODE_ENV=production
PORT=5000

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

FRONTEND_URL=https://your-frontend.vercel.app
```

**Save each variable!**

---

## Step 3: Setup Supabase Database

### Create Supabase Project
1. Go to **https://supabase.com**
2. Click **"New Project"**
3. Create project (note your credentials)

### Run Database Schema
1. Go to **SQL Editor** in Supabase
2. Click **"New Query"**
3. Open file: `database/schema.sql`
4. Copy all content
5. Paste and **Run** in Supabase SQL Editor
6. Wait for confirmation ✅

### Get Credentials
1. Go to **Settings → API**
2. Copy:
   - **Project URL** → use as `SUPABASE_URL`
   - **anon public** key → use as `SUPABASE_ANON_KEY`

### Update Railway
1. Go back to Railway
2. Paste these values into the environment variables
3. **Deploy** will restart automatically

---

## Step 4: Test Your Deployments

### Test Backend
```bash
# Get your Railway URL from dashboard
curl https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Test Frontend
1. Visit your Vercel URL
2. Should load successfully ✅

---

## Step 5: Connect Frontend to Backend

### Update Frontend API URL
1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add/Update:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. Click **Save**
6. Go to **Deployments** tab
7. Click **"Redeploy"** → Latest

---

## Step 6: Verify Everything Works

### Test End-to-End
1. Open your Vercel frontend URL
2. Should see the LearnerAI landing page
3. Check browser console (F12) for errors
4. All API calls should work ✅

---

## Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard
- **GitHub Actions**: https://github.com/WijdanEslim24/learnerAI/actions

---

## Troubleshooting

### Backend Won't Start
**Error**: Missing Supabase configuration  
**Fix**: Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Railway

### Frontend Can't Connect
**Error**: CORS or connection error  
**Fix**: Set `VITE_API_URL` in Vercel to your Railway URL

### Database Errors
**Error**: Connection refused  
**Fix**: Verify Supabase credentials in Railway

---

## What You Need

### GitHub Secrets (Optional - for auto-deploy)
- If you want auto-deployment via GitHub Actions:
- Add to GitHub → Settings → Secrets → Actions:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `RAILWAY_TOKEN`

---

## Status Checklist

- [ ] Railway project created
- [ ] Backend service configured
- [ ] Environment variables set in Railway
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Railway backend deployed
- [ ] Backend URL obtained
- [ ] Frontend API URL updated in Vercel
- [ ] Frontend redeployed
- [ ] Everything tested ✅

---

## You're Done! 🎉

Your LearnerAI app should now be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Database**: Supabase (connected)

---

**Need help?** Check the logs:
- Railway: Click "View Logs" in dashboard
- Vercel: Click on deployment → View logs
