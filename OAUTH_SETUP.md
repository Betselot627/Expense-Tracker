# OAuth Setup Guide - Quick Start

## Step 1: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API (or Google Identity)
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen (if not done):
   - User Type: External
   - App name: Expense Tracker
   - User support email: your email
   - Developer contact: your email
6. Create OAuth Client ID:
   - Application type: Web application
   - Name: Expense Tracker Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5173`
   - Authorized redirect URIs:
     - `http://localhost:5173`
7. Copy the Client ID
8. Update `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
   ```
9. Update `frontend/expense-tracker/.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
   ```

## Step 2: GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: `Expense Tracker`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:8000/api/v1/auth/github/callback`
4. Click "Register application"
5. Copy the Client ID
6. Click "Generate a new client secret" and copy it
7. Update `backend/.env`:
   ```
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

## Step 3: Complete Backend .env

Your `backend/.env` should have:

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
PORT=8000

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:8000/api/v1/auth/github/callback
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=generate-a-random-secret-key-here
CLIENT_URL=http://localhost:5173
```

## Step 4: Complete Frontend .env

Your `frontend/expense-tracker/.env` should have:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:8000
```

## Step 5: Test

1. Restart backend: `cd backend && npm run dev`
2. Restart frontend: `cd frontend/expense-tracker && npm run dev`
3. Navigate to `http://localhost:5173/login`
4. Try Google or GitHub login

## Troubleshooting

### Google: "Access blocked: Authorization Error"

- Make sure `VITE_GOOGLE_CLIENT_ID` in frontend/.env matches the Client ID from Google Console
- Ensure `http://localhost:5173` is in Authorized JavaScript origins
- Restart the frontend dev server after changing .env

### GitHub: "Cannot GET /api/v1/auth/github"

- Verify backend is running on port 8000
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in backend/.env
- Ensure callback URL in GitHub app settings matches: `http://localhost:8000/api/v1/auth/github/callback`

### Both: CORS errors

- Verify `CLIENT_URL=http://localhost:5173` in backend/.env
- Restart backend server
