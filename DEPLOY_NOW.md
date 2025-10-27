# 🚀 Quick Deployment Guide

## ✅ Code Pushed to GitHub
Your project has been successfully pushed to: `https://github.com/WijdanEslim24/learnerAI.git`

---

## 🎯 Two Options to Deploy

### Option 1: Manual Deployment (Recommended for First Time)

#### Frontend on Vercel:

1. **Go to [Vercel Dashboard](https://vercel.com)**
2. Click **"Add New Project"** or **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose **`WijdanEslim24/learnerAI`**
5. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `learnerAI/frontend`
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `dist` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)
6. Click **"Deploy"**
7. Wait for deployment to complete (~2-3 minutes)

#### Backend on Railway:

1. **Go to [Railway Dashboard](https://railway.app)**
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select **`WijdanEslim24/learnerAI`**
4. **Configure Service:**
   - Railway will auto-detect Node.js
   - **Root Directory:** `learnerAI/backend`
   - **Start Command:** `npm start`
5. **Add Environment Variables:**
   ```bash
   NODE_ENV=production
   PORT=${{PORT}}
   FRONTEND_URL=https://your-frontend.vercel.app
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```
6. Click **"Deploy"**

---

### Option 2: Automated Deployment with GitHub Actions

The GitHub Actions workflow is already set up! You just need to add secrets:

#### Add GitHub Secrets:

1. Go to: `https://github.com/WijdanEslim24/learnerAI/settings/secrets/actions`
2. Click **"New repository secret"** for each:

**For Vercel:**
- `VERCEL_TOKEN` - Get from [Vercel Settings → Tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` - Found in Vercel project settings
- `VERCEL_PROJECT_ID` - Found in Vercel project settings

**For Railway:**
- `RAILWAY_TOKEN` - Get from Railway → Account Settings → Tokens
- `RAILWAY_SERVICE_ID` - Found after first deployment in Railway

**For Environment:**
- `VITE_API_URL` - Your Railway backend URL (add after backend is deployed)

#### To Deploy:
```bash
# Already pushed! The workflow will:
# 1. Deploy frontend to Vercel on every push
# 2. Deploy backend to Railway on every push
```

---

## 📝 Environment Variables Checklist

### Vercel (Frontend)
```bash
VITE_API_URL=https://your-backend.railway.app
```

### Railway (Backend)
```bash
NODE_ENV=production
PORT=${{PORT}}
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
```

---

## 🔗 Quick Links

- **GitHub Repo:** https://github.com/WijdanEslim24/learnerAI
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Railway Dashboard:** https://railway.app/dashboard

---

## 🎉 Ready to Deploy?

**Right now, you can:**

1. **Go to [Vercel](https://vercel.com/dashboard)** → Import your repo → Deploy
2. **Go to [Railway](https://railway.app)** → Import your repo → Deploy

**OR**

1. Set up GitHub secrets (see Option 2 above)
2. Push any changes to trigger automatic deployment
3. Watch the magic happen! ✨

---

## 📊 Deployment Status

After deployment, your app will be available at:
- **Frontend:** `https://learner-ai-frontend.vercel.app`
- **Backend:** `https://your-service.railway.app`

Test the backend health endpoint:
```bash
curl https://your-service.railway.app/health
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

## 🆘 Need Help?

- Check logs in Vercel Dashboard → Your Project → Deployments
- Check logs in Railway Dashboard → Your Service → Logs
- Check GitHub Actions: `https://github.com/WijdanEslim24/learnerAI/actions`
