---
description: How to deploy the MasterIt Studio application to Vercel
---

# Deploying to Vercel

This workflow guides you through deploying the application to Vercel.

## Prerequisites

- A Vercel account
- The Vercel CLI installed (`npm i -g vercel`) OR a Git repository connected to Vercel.

## Option 1: Git Integration (Recommended)

This is the "Set and Forget" method.

1. Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2. Log in to Vercel.
3. Click "Add New Project" -> "Import" your repository.
4. Vercel will auto-detect "Vite" framework settings.
5. **Environment Variables**: Go to Settings -> Environment Variables and add any secrets (e.g., `VITE_OPENAI_API_KEY`).
6. Click "Deploy". Every push to `main` will now auto-deploy.

## Option 2: Vercel CLI (Manual)

Use this for quick previews or if you don't want to connect Git yet.

1. **Login**:

    ```bash
    npx vercel login
    ```

2. **Deploy**:
    Run the command:

    ```bash
    npx vercel
    ```

    - Follow the prompts (Select scope, Link to existing project? [No], Project Name? [enter name], Directory? [./]).
    - It will inspect `package.json` and detect the Build Command (`vite build`) and Output Directory (`dist`).
3. **Production Deploy**:
    To deploy a production version (not a preview URL), run:

    ```bash
    npx vercel --prod
    ```

## Post-Deployment Checklist

- [ ] **Verify Routing**: Visit a sub-page (e.g., `/concepts`), refresh the browser. If it 404s, `vercel.json` rewrites are missing.
- [ ] **Check Logs**: In Vercel dashboard, check "Runtime Logs" if API calls fail.
- [ ] **Custom Domain**: (Optional) Add your domain in Vercel Project Settings -> Domains.
