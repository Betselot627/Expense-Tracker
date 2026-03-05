# Deployment Guide

## Auto-Deploy Frontend to Vercel via GitHub Actions

### Prerequisites

1. A Vercel account
2. A GitHub repository with this code
3. Vercel CLI installed locally (optional, for initial setup)

### Setup Instructions

#### 1. Link Your Project to Vercel

First, you need to link your project to Vercel. You can do this in two ways:

**Option A: Using Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set the root directory to `frontend/expense-tracker`
5. Add environment variable: `VITE_API_URL` = `https://expense-tracker-s9zd.onrender.com/api/v1`
6. Deploy once manually

**Option B: Using Vercel CLI**

```bash
cd frontend/expense-tracker
npm install -g vercel
vercel login
vercel link
```

#### 2. Get Vercel Tokens

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with a descriptive name (e.g., "GitHub Actions Deploy")
3. Copy the token (you'll only see it once!)

#### 3. Get Vercel Project Information

Run these commands in your `frontend/expense-tracker` directory:

```bash
# Get your Vercel Organization ID
vercel whoami

# Get your Project ID (after linking)
cat .vercel/project.json
```

#### 4. Add GitHub Secrets

Go to your GitHub repository settings:

1. Navigate to: `Settings` → `Secrets and variables` → `Actions`
2. Click "New repository secret" and add these secrets:

| Secret Name         | Value                                              | Description                 |
| ------------------- | -------------------------------------------------- | --------------------------- |
| `VERCEL_TOKEN`      | Your Vercel token                                  | Token from step 2           |
| `VERCEL_ORG_ID`     | Your org/team ID                                   | From `vercel whoami`        |
| `VERCEL_PROJECT_ID` | Your project ID                                    | From `.vercel/project.json` |
| `VITE_API_URL`      | `https://expense-tracker-s9zd.onrender.com/api/v1` | Backend API URL             |

#### 5. Update Vercel Project Settings (Optional)

In your Vercel project settings:

1. Go to `Settings` → `Environment Variables`
2. Add: `VITE_API_URL` = `https://expense-tracker-s9zd.onrender.com/api/v1`
3. Make sure it's enabled for Production, Preview, and Development

#### 6. Update Backend CORS

Make sure your backend allows the Vercel domain. Add to `backend/server.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-bets.netlify.app",
      "https://your-vercel-domain.vercel.app", // Add your Vercel domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
```

#### 7. Trigger Deployment

The GitHub Action will automatically deploy when you:

- Push to `main` or `master` branch
- Make changes in the `frontend/` directory
- Modify the workflow file

To manually trigger:

```bash
git add .
git commit -m "Setup Vercel auto-deployment"
git push origin main
```

### Workflow Behavior

- **On Push to main/master**: Deploys to production
- **On Pull Request**: Creates a preview deployment
- **Only triggers when**: Frontend files change

### Monitoring Deployments

1. **GitHub Actions**: Check the "Actions" tab in your repository
2. **Vercel Dashboard**: View deployments at [vercel.com/dashboard](https://vercel.com/dashboard)

### Troubleshooting

**Build fails with "VERCEL_TOKEN not found"**

- Make sure you added the secret in GitHub repository settings
- Secret names are case-sensitive

**Build succeeds but site doesn't work**

- Check if `VITE_API_URL` is set correctly
- Verify backend CORS allows your Vercel domain
- Check browser console for errors

**Changes not deploying**

- Ensure changes are in the `frontend/` directory
- Check if the workflow file is in `.github/workflows/`
- Verify the branch name matches (main vs master)

### Alternative: Vercel Git Integration

If you prefer Vercel's built-in Git integration instead of GitHub Actions:

1. Go to Vercel Dashboard
2. Import your GitHub repository
3. Set root directory to `frontend/expense-tracker`
4. Add environment variables
5. Vercel will auto-deploy on every push

This is simpler but gives you less control over the deployment process.

---

## Current Deployment URLs

- **Frontend (Netlify)**: https://expense-tracker-bets.netlify.app
- **Frontend (Vercel)**: Will be available after setup
- **Backend (Render)**: https://expense-tracker-s9zd.onrender.com
