# 🚀 Vercel Deployment Fix

## Why Vercel Deployment Wasn't Working

The issue was with the path configuration. Here's how to fix it:

---

## ✅ Solution: Manual Deployment (Easiest)

### Step 1: Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### Step 2: Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Import repository: `WijdanEslim24/learnerAI`
3. Click **"Import"**

### Step 3: Configure Settings ⚠️ **IMPORTANT**
In the project configuration page:

1. **Framework Preset:** Vite (auto-detected)
2. **Root Directory:** Click "Edit" → Select `learnerAI/frontend`
3. **Build Command:** `npm run build` (auto-filled)
4. **Output Directory:** `dist` (auto-filled)
5. **Install Command:** `npm install` (auto-filled)

### Step 4: Environment Variables
Click "Environment Variables" and add:
```
VITE_API_URL=https://your-backend.railway.app
```
(Replace with your actual backend URL after deploying the backend)

### Step 5: Deploy
Click **"Deploy"** button

---

## 🎯 Alternative: Vercel CLI

If you want to deploy via terminal:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the frontend
cd learnerAI/frontend

# Deploy
vercel --prod
```

Answer the prompts:
- Set up and deploy? → **Y**
- Which scope? → Your account
- Link to existing project? → **Y** (if you already created one in dashboard)
- Or create new? → **Y** (to create new)
- What directory contains your app? → **.** (current directory)

---

## ❌ Common Issues and Fixes

### Issue 1: "Cannot find module" errors
**Solution:** Make sure Root Directory is set to `learnerAI/frontend` in Vercel dashboard

### Issue 2: Build fails with "dist directory not found"
**Solution:** The output directory should be `dist` (not `frontend/dist`)

### Issue 3: 404 errors on routes
**Solution:** Add `vercel.json` with rewrites (already done in frontend/vercel.json)

### Issue 4: Environment variables not working
**Solution:** 
1. Add env vars in Vercel dashboard
2. Redeploy after adding env vars
3. Make sure variable names start with `VITE_` for Vite projects

---

## 📝 Quick Checklist

Before deploying, ensure:
- [ ] Root Directory: `learnerAI/frontend` (set in dashboard)
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Framework: Vite

---

## 🔗 Quick Links

- **Your Repo:** https://github.com/WijdanEslim24/learnerAI
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deploy Now:** https://vercel.com/new

---

## ✅ After Deployment

Your app will be live at: `https://learner-ai-frontend.vercel.app` (or similar)

Test it by visiting the URL!

