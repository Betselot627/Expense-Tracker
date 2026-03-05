# How to Connect Vercel to Your GitHub Repository

## Problem

GitHub Actions are working, but Vercel is not deploying automatically.

## Solution

You need to properly connect Vercel to your GitHub repository. Follow these steps:

---

## Step 1: Check Current Vercel Connection

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project (or create a new one if it doesn't exist)
3. Click on your project
4. Go to **Settings** → **Git**

### What You Should See:

- **If connected**: You'll see your GitHub repository name
- **If NOT connected**: You'll see "No Git repository connected"

---

## Step 2: Connect to GitHub (If Not Connected)

### Option A: Import New Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub account
5. Find and select your **Expense-Tracker** repository
6. Click **"Import"**

### Option B: Connect Existing Project

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Git**
3. Click **"Connect Git Repository"**
4. Select your GitHub repository
5. Authorize Vercel if prompted

---

## Step 3: Configure Project Settings

Once connected, configure these settings:

### General Settings (Settings → General)

| Setting              | Value                                                                        |
| -------------------- | ---------------------------------------------------------------------------- |
| **Root Directory**   | `frontend/expense-tracker`                                                   |
| **Framework Preset** | `Vite`                                                                       |
| **Build Command**    | `cd .. && npm install && cd expense-tracker && npm install && npm run build` |
| **Output Directory** | `dist`                                                                       |
| **Install Command**  | `npm install`                                                                |

### Why the custom build command?

Your project has dependencies in both `frontend/` (Tailwind CSS v4) and `frontend/expense-tracker/` (React app). The build command installs both.

---

## Step 4: Add Environment Variables

Go to **Settings** → **Environment Variables** and add:

| Name           | Value                                              |
| -------------- | -------------------------------------------------- |
| `VITE_API_URL` | `https://expense-tracker-s9zd.onrender.com/api/v1` |

Make sure to enable it for:

- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

---

## Step 5: Configure Git Settings

Go to **Settings** → **Git** and verify:

| Setting                | Value                                       |
| ---------------------- | ------------------------------------------- |
| **Production Branch**  | `main` (or `master` if that's your default) |
| **Ignored Build Step** | Leave empty (or default)                    |

---

## Step 6: Trigger First Deployment

### Method 1: Redeploy from Vercel

1. Go to **Deployments** tab
2. Click on the latest deployment (if any)
3. Click **"Redeploy"** button

### Method 2: Push to GitHub

1. Make any small change to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Trigger Vercel deployment"
   git push origin main
   ```

---

## Step 7: Verify Deployment

After pushing or redeploying:

1. **Check Vercel Dashboard**
   - Go to **Deployments** tab
   - You should see a new deployment in progress
   - Click on it to see build logs

2. **Check GitHub**
   - Go to your repository
   - Look for a comment from the Vercel bot on your latest commit
   - It will show deployment status and preview URL

3. **Check Email**
   - You should receive an email about the deployment

---

## Troubleshooting

### "No deployments are happening"

**Check 1: Is Git connected?**

- Settings → Git → Should show your repository name
- If not, follow Step 2 again

**Check 2: Is the branch correct?**

- Settings → Git → Production Branch should match your default branch
- Check your GitHub repository to see if it's `main` or `master`

**Check 3: GitHub permissions**

- Go to GitHub → Settings → Applications → Authorized OAuth Apps
- Find Vercel and ensure it has access to your repository

### "Build is failing"

**Check build logs in Vercel:**

1. Go to Deployments tab
2. Click on the failed deployment
3. Read the error message

**Common issues:**

- Missing environment variables → Add `VITE_API_URL`
- Wrong root directory → Should be `frontend/expense-tracker`
- Dependency errors → Use the custom build command from Step 3

### "Build succeeds but site doesn't work"

**Check 1: Environment variables**

- Settings → Environment Variables
- Ensure `VITE_API_URL` is set correctly
- Redeploy after adding variables

**Check 2: Backend CORS**

- Get your Vercel URL (e.g., `https://your-project.vercel.app`)
- Add it to `backend/server.js` CORS configuration:
  ```javascript
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "https://expense-tracker-bets.netlify.app",
        "https://your-project.vercel.app", // Add this
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );
  ```

**Check 3: Browser console**

- Open your deployed site
- Press F12 to open developer tools
- Check Console tab for errors

---

## Expected Behavior After Setup

Once everything is configured:

1. **You push code to GitHub** → Vercel detects the push
2. **Vercel builds your project** → You get a notification
3. **Vercel deploys to production** → New URL is live
4. **Vercel comments on GitHub** → Shows deployment status

No manual intervention needed!

---

## Quick Checklist

- [ ] Vercel project exists
- [ ] Git repository is connected (Settings → Git)
- [ ] Root directory is `frontend/expense-tracker`
- [ ] Build command includes parent directory install
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Production branch matches your GitHub branch
- [ ] Pushed a commit to trigger deployment
- [ ] Checked Vercel Dashboard for deployment status

---

## Need Help?

If you're still having issues:

1. **Check Vercel deployment logs** for specific error messages
2. **Verify GitHub connection** in both Vercel and GitHub settings
3. **Try manual deployment** from Vercel Dashboard first
4. **Check if Vercel has GitHub permissions** in your GitHub account settings

Once you complete these steps, Vercel will automatically deploy every time you push to GitHub!
