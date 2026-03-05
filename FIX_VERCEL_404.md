# Fix Vercel 404 Error

## What I Fixed

The 404 error was happening because Vercel couldn't find the Tailwind CSS dependencies that were in the parent `frontend/` directory.

**Solution**: I moved the Tailwind CSS dependencies into `frontend/expense-tracker/package.json` so everything is self-contained.

---

## What You Need to Do Now

### Step 1: Install the New Dependencies Locally

Run this in your terminal:

```bash
cd frontend/expense-tracker
npm install
```

This will install the Tailwind CSS dependencies I just added to package.json.

### Step 2: Commit and Push

```bash
git add .
git commit -m "Fix Vercel build - add Tailwind dependencies"
git push origin main
```

### Step 3: Configure Vercel (If Not Already Done)

Go to https://vercel.com/dashboard and:

1. **Import your project** (if not already imported)
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure these settings**:
   - **Root Directory**: `frontend/expense-tracker`
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (default is fine)
   - **Output Directory**: `dist` (default is fine)
   - **Install Command**: `npm install` (default is fine)

3. **Add Environment Variable**:
   - Name: `VITE_API_URL`
   - Value: `https://expense-tracker-s9zd.onrender.com/api/v1`
   - Enable for: Production, Preview, Development

4. **Click "Deploy"**

---

## What Changed

### Before:

- Tailwind CSS was in `frontend/package.json`
- Vite config referenced parent directory dependencies
- Vercel couldn't access parent directory from root directory setting

### After:

- Tailwind CSS is now in `frontend/expense-tracker/package.json`
- Everything is self-contained in one directory
- Vercel can build successfully

---

## Verify It Works

After deploying:

1. **Check Vercel Dashboard** - Build should succeed
2. **Visit your Vercel URL** - Site should load
3. **Test the app** - Try logging in and adding expenses

If API calls fail, make sure to add your Vercel URL to backend CORS (see below).

---

## Update Backend CORS

Once you get your Vercel URL (e.g., `https://expense-tracker-xyz.vercel.app`), add it to `backend/server.js`:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-bets.netlify.app",
      "https://expense-tracker-xyz.vercel.app", // Add your actual Vercel URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
```

Then redeploy your backend on Render.

---

## Summary

1. ✅ Fixed: Moved Tailwind dependencies to expense-tracker package.json
2. ✅ Fixed: Simplified vercel.json configuration
3. ✅ Fixed: Updated GitHub Actions workflow
4. 🔄 Next: Install dependencies locally (`npm install`)
5. 🔄 Next: Push to GitHub
6. 🔄 Next: Configure and deploy on Vercel
7. 🔄 Next: Update backend CORS with Vercel URL

Your backend on Render is working fine - the 404 was only from Vercel!
