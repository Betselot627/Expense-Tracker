# Deployment Guide

## Auto-Deploy Frontend to Vercel (Simple Method)

Since you've already imported your project on Vercel, deployments will happen automatically! No GitHub Actions or secrets needed.

### How It Works

Vercel's Git integration automatically:

- Detects when you push to GitHub
- Builds your project
- Deploys to production (for main/master branch)
- Creates preview deployments (for other branches/PRs)

### Setup Checklist

#### 1. Verify Vercel Connection

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project
3. Go to `Settings` → `Git`
4. Ensure your GitHub repository is connected
5. Verify the branch is set to `main` or `master`

#### 2. Configure Root Directory

In Vercel project settings:

1. Go to `Settings` → `General`
2. Set "Root Directory" to `frontend/expense-tracker`
3. Framework Preset should be "Vite"
4. Save changes

#### 3. Add Environment Variables

In Vercel project settings:

1. Go to `Settings` → `Environment Variables`
2. Add: `VITE_API_URL` = `https://expense-tracker-s9zd.onrender.com/api/v1`
3. Make sure it's enabled for Production, Preview, and Development
4. Save

#### 4. Update Backend CORS

Make sure your backend allows the Vercel domain. In `backend/server.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-bets.netlify.app",
      "https://your-project.vercel.app", // Add your actual Vercel domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
```

#### 5. Trigger First Deployment

Make any small change and push:

```bash
git add .
git commit -m "Trigger Vercel deployment"
git push origin main
```

### Monitoring Deployments

1. **Vercel Dashboard**: View all deployments at [vercel.com/dashboard](https://vercel.com/dashboard)
2. **GitHub**: Vercel bot will comment on commits/PRs with deployment status
3. **Email**: You'll receive notifications for successful/failed deployments

### Troubleshooting

**No deployments happening?**

- Check Vercel Dashboard → Settings → Git to verify connection
- Ensure you're pushing to the correct branch (main/master)
- Check if "Production Branch" is set correctly in Vercel settings

**Build fails?**

- Check Vercel deployment logs in the dashboard
- Verify `VITE_API_URL` environment variable is set
- Ensure root directory is `frontend/expense-tracker`

**Site works but API calls fail?**

- Update backend CORS to include your Vercel domain
- Check browser console for CORS errors
- Verify `VITE_API_URL` is correct in Vercel environment variables

---

## Current Deployment URLs

- **Frontend (Netlify)**: https://expense-tracker-bets.netlify.app
- **Frontend (Vercel)**: Will be available after setup
- **Backend (Render)**: https://expense-tracker-s9zd.onrender.com
