# Deploy Backend Changes to Render

## The Problem

The CORS error is happening because:

1. ✅ I updated `backend/server.js` to include your Vercel URL
2. ❌ The changes are only on your local machine
3. ❌ Render is still running the old code without your Vercel URL

## The Solution

You need to push the changes to GitHub, then Render will automatically redeploy.

---

## Step 1: Commit and Push Changes

Run these commands in your terminal:

```bash
# Make sure you're in the project root directory
git add .

# Commit the changes
git commit -m "Add Vercel URL to backend CORS and fix dependencies"

# Push to GitHub
git push origin main
```

---

## Step 2: Wait for Render to Deploy

After you push to GitHub:

1. Go to https://dashboard.render.com
2. Find your backend service: **expense-tracker-s9zd**
3. You should see a new deployment starting automatically
4. Wait for the deployment to complete (usually 2-3 minutes)
5. Look for the message: **"Your service is live 🎉"**

### If Render Doesn't Auto-Deploy:

1. Click on your service
2. Click **"Manual Deploy"** button (top right)
3. Select **"Deploy latest commit"**
4. Wait for deployment to complete

---

## Step 3: Test Your Vercel Site

After Render finishes deploying:

1. Go to https://expense-tracker-rose-mu-20.vercel.app
2. Try logging in with Google OAuth
3. Try regular email/password login
4. Test adding income/expense

---

## What's Being Deployed

The changes include:

### 1. Backend CORS Update

```javascript
origin: [
  "http://localhost:5173",
  "https://expense-tracker-bets.netlify.app",
  "https://expense-tracker-rose-mu-20.vercel.app", // ← New!
];
```

### 2. Frontend Dependencies

- Added Tailwind CSS to `frontend/expense-tracker/package.json`
- Fixed GitHub Actions workflow
- Updated Vercel configuration

---

## Expected Result

After deployment completes:

✅ CORS errors will be gone
✅ API calls will work from Vercel
✅ Regular login will work
✅ Google OAuth will work (after you add Vercel URL to Google Cloud Console)

---

## Troubleshooting

### "Nothing to commit" error?

If git says there's nothing to commit, the changes might already be committed. Just run:

```bash
git push origin main
```

### Push is rejected?

If you get a push error, try:

```bash
git pull origin main --rebase
git push origin main
```

### Render still shows old code?

1. Check the deployment logs on Render
2. Make sure the commit hash matches your latest commit
3. Try manual deploy if auto-deploy didn't trigger

---

## Quick Commands

Copy and paste these:

```bash
git add .
git commit -m "Add Vercel URL to backend CORS"
git push origin main
```

Then wait for Render to deploy (check https://dashboard.render.com).

---

## After Backend Deploys

Don't forget to also:

1. **Add Vercel URL to Google Cloud Console** (for OAuth to work)
   - Go to https://console.cloud.google.com
   - APIs & Services → Credentials
   - Add `https://expense-tracker-rose-mu-20.vercel.app` to Authorized JavaScript origins

2. **Test everything works**
   - Login with email/password
   - Login with Google
   - Add income/expense
   - View dashboard

That's it! Once you push and Render deploys, the CORS errors will be gone.
