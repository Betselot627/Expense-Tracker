# Fix Google OAuth for Vercel Deployment

## The Errors

1. ✅ **CORS Error** - FIXED! I added your Vercel domain to backend CORS
2. ❌ **Google OAuth Error** - You need to add Vercel domain to Google Cloud Console

---

## What I Fixed

### 1. Backend CORS (DONE ✅)

I added your Vercel URL to `backend/server.js`:

```javascript
origin: [
  "http://localhost:5173",
  "https://expense-tracker-bets.netlify.app",
  "https://expense-tracker-rose-mu-20.vercel.app", // ← Added this
];
```

**You need to redeploy your backend on Render** for this to take effect:

1. Go to https://dashboard.render.com
2. Find your backend service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for deployment to complete

---

## What You Need to Fix

### 2. Google OAuth Configuration (TODO ❌)

The error says:

```
The given origin is not allowed for the given client ID
```

This means Google doesn't recognize your Vercel domain. You need to add it to Google Cloud Console.

### Steps to Fix Google OAuth:

#### Step 1: Go to Google Cloud Console

1. Go to https://console.cloud.google.com
2. Select your project (the one with your OAuth credentials)
3. Go to **APIs & Services** → **Credentials**

#### Step 2: Find Your OAuth Client

1. Look for **"OAuth 2.0 Client IDs"** section
2. Click on your client ID (the one you're using in your app)

#### Step 3: Add Authorized JavaScript Origins

In the **"Authorized JavaScript origins"** section, add:

```
https://expense-tracker-rose-mu-20.vercel.app
```

Click **"+ ADD URI"** and paste the URL above.

#### Step 4: Add Authorized Redirect URIs (if needed)

In the **"Authorized redirect URIs"** section, add:

```
https://expense-tracker-rose-mu-20.vercel.app/oauth/callback
```

(Only if you're using OAuth callback redirects)

#### Step 5: Save

1. Click **"SAVE"** at the bottom
2. Wait a few minutes for changes to propagate (usually instant, but can take up to 5 minutes)

---

## Testing After Fixes

### Step 1: Redeploy Backend

1. Go to Render Dashboard
2. Deploy latest commit
3. Wait for "Your service is live 🎉"

### Step 2: Test Your Vercel Site

1. Go to https://expense-tracker-rose-mu-20.vercel.app
2. Try to log in with Google
3. Try regular email/password login
4. Check if API calls work

---

## Current Configuration Summary

### Frontend URLs:

- Local: `http://localhost:5173`
- Netlify: `https://expense-tracker-bets.netlify.app`
- Vercel: `https://expense-tracker-rose-mu-20.vercel.app` ✅

### Backend URL:

- Render: `https://expense-tracker-s9zd.onrender.com`

### What's Configured:

- ✅ Backend CORS includes Vercel URL
- ✅ Vercel environment variable `VITE_API_URL` is set
- ❌ Google OAuth needs Vercel URL added

---

## Quick Checklist

- [ ] Redeploy backend on Render (to apply CORS changes)
- [ ] Add Vercel URL to Google Cloud Console OAuth settings
- [ ] Wait 5 minutes for Google changes to propagate
- [ ] Test login on Vercel site
- [ ] Test API calls (add income/expense)

---

## If You Still Get Errors

### CORS Error Persists:

- Make sure backend redeployed successfully on Render
- Check backend logs on Render for any errors
- Verify the Vercel URL is exactly: `https://expense-tracker-rose-mu-20.vercel.app`

### Google OAuth Error Persists:

- Double-check the URL in Google Cloud Console (no typos)
- Wait 5-10 minutes for changes to propagate
- Try in incognito/private browsing mode
- Clear browser cache and cookies

### API Calls Fail:

- Check browser console for specific error messages
- Verify `VITE_API_URL` is set in Vercel environment variables
- Make sure backend is running on Render

---

## Need to Find Your Google OAuth Settings?

1. Go to https://console.cloud.google.com
2. Select your project from the dropdown at the top
3. Click the hamburger menu (☰) → **APIs & Services** → **Credentials**
4. Look for your OAuth 2.0 Client ID
5. Click the pencil icon (✏️) to edit
6. Add your Vercel URL to "Authorized JavaScript origins"
7. Save

That's it! Once you add the Vercel URL to Google OAuth and redeploy your backend, everything should work perfectly.
