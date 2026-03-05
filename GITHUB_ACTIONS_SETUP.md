# GitHub Actions Setup (Optional)

## Current Setup

You have one GitHub Actions workflow that runs on every push:

### Build and Test Frontend

- **File**: `.github/workflows/build-frontend.yml`
- **Purpose**: Tests that your frontend builds successfully
- **Triggers**: On push to main/master, or pull requests
- **Does NOT deploy**: This only validates the build works

## Why No Deployment Action?

Since you've already connected your GitHub repository to Vercel through the Vercel dashboard, **Vercel handles deployments automatically**. You don't need GitHub Actions for deployment.

## How Vercel Auto-Deploy Works

1. You push code to GitHub
2. Vercel detects the push
3. Vercel builds and deploys automatically
4. You get a deployment URL

## If You Want GitHub Actions to Deploy

If you prefer GitHub Actions to handle deployment instead of Vercel's Git integration, you would need to:

1. Create GitHub secrets:
   - `VERCEL_TOKEN` - From Vercel account settings
   - `VERCEL_ORG_ID` - Your organization ID
   - `VERCEL_PROJECT_ID` - Your project ID

2. Use a workflow like this:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main, master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm install --global vercel@latest
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: frontend/expense-tracker
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: frontend/expense-tracker
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: frontend/expense-tracker
```

## Recommendation

**Stick with Vercel's Git integration** - it's simpler, requires no secrets, and works automatically. The build-only GitHub Action is useful for catching build errors early in pull requests.
