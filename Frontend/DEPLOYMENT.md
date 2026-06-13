# Render Frontend Deployment Guide (Static Site)

This guide describes how to deploy the React Frontend application to Render as a Static Site.

## Prerequisites

1. Your backend application should already be deployed (e.g. on Render as a Web Service) so you have its live URL.
2. Your project repository must be pushed to a Git provider (e.g., GitHub or GitLab) connected to Render.

---

## Step 1: Create a Static Site on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New** (top right) and select **Static Site**.
3. Connect your Git repository containing the project.

---

## Step 2: Configure Build Settings

Configure the following settings in the Render dashboard:

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Name** | `skilltraverse-frontend` (or your choice) | Name of your site |
| **Branch** | `main` (or your primary branch) | The git branch to build |
| **Root Directory** | `Frontend` | **CRITICAL**: The subdirectory of your project containing frontend code |
| **Build Command** | `npm install && npm run build` | Installs dependencies and runs Vite compilation |
| **Publish Directory** | `dist` | **CRITICAL**: The folder containing compiled static assets (created by Vite) |

---

## Step 3: Configure Environment Variables

Under the **Environment** tab of your new Static Site, add the following environment variable:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://skilltraverse-backend.onrender.com` | **CRITICAL**: The live URL of your deployed backend service (Express server) |

---

## Step 4: Configure Rewrite Rules for React Router (Single Page Application)

Since this app uses client-side routing (`react-router-dom`), refreshing any page other than the homepage (e.g. `/login` or `/interview`) will return a 404 error unless you configure rewrite rules.

1. In your Static Site settings on Render, navigate to the **Redirects/Rewrites** tab.
2. Click **Add Rule**.
3. Set up the following rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite` (Status `200`)
4. Save the rule.

---

## Step 5: Deploy

1. Click **Create Static Site** (or trigger a deploy).
2. Once Render compiles your site, it will give you a live URL (e.g. `https://skilltraverse-frontend.onrender.com`).
3. **Important**: Go back to your **Backend** service settings on Render, and add/update the `FRONTEND_URL` environment variable with this new frontend URL to ensure CORS allows credentials and cookies.
