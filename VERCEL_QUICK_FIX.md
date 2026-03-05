# Vercel Not Deploying? Quick Fix

## The Issue

GitHub Actions work, but Vercel doesn't deploy automatically.

## The Solution

Vercel isn't connected to your GitHub repository. Follow these 3 steps:

---

## Step 1: Connect Vercel to GitHub

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your **Expense-Tracker** repository
5. Click **"Import"**

---

## Step 2: Configure Settings

Before clicking "Deploy", configure these:

### Root Directory

```
frontend/expense-tracker
```

### Build Command

Leave as default or use:

```bash
npm run build
```

### Install Command

Leave as default or use:

```bash
npm install
```

### Output Directory

```
dist
```

### Environment Variables

Add this variable:

- **Name**: `VITE_API_URL`
- **Value**: `https://expense-tracker-s9zd.onrender.com/api/v1`
- **Environments**: Production, Preview, Development

---

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Get your deployment URL (e.g., `https://your-project.vercel.app`)

---

## After First Deployment

### Update Backend CORS

Add your Vercel URL to `backend/server.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-bets.netlify.app",
      "https://your-project.vercel.app", // Add your Vercel URL here
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
```

### Test Auto-Deploy

1. Make a small change to your code
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. Check Vercel Dashboard for new deployment

---

## That's It!

From now on, every push to GitHub will automatically deploy to Vercel.

**Need detailed help?** See `VERCEL_CONNECTION_GUIDE.md`
