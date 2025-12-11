# Contract Management App

## 🚀 Deployment Instructions for Render

This project is configured to be deployed on [Render.com](https://render.com) as a Static Site.

### Step 1: Push to GitHub
1.  Initialize Git (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a **New Repository** on GitHub (do not initialize with README/license).
3.  Connect and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

### Step 2: Deploy on Render
1.  Log in to [Render](https://render.com).
2.  Click **"New +"** -> **"Static Site"**.
3.  Connect your GitHub account and select this repository.
4.  Render will automatically use the `render.yaml` file to configure the build.
    - Build Command: `npm install && npm run build`
    - Publish Directory: `dist`
5.  **Environment Variables**:
    - Render *should* detect them from `render.yaml` but for security they are not sync'd.
    - Go to **"Environment"** tab in Render dashboard.
    - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` manually.

## 🛠 Local Development
- `npm install`
- `npm run dev`
