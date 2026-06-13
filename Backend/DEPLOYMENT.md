# Render Native Node.js Deployment Guide

This guide describes how to deploy the Backend service to Render using the native Node.js runtime (without Docker).

## Prerequisites

1. Your project repository must be pushed to a Git provider (e.g., GitHub or GitLab) connected to Render.

---

## Step 1: Create a Web Service on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New** (top right) and select **Web Service**.
3. Connect your Git repository containing the project.

---

## Step 2: Configure Service Settings

Configure the following settings in the Render dashboard:

| Setting | Value | Description |
| :--- | :--- | :--- |
| **Name** | `skilltraverse-backend` (or your choice) | Name of your service |
| **Language** | `Node` | Native Node runtime |
| **Root Directory** | `Backend` | **CRITICAL**: The subdirectory of your project containing backend code |
| **Build Command** | `npm install && npm run build` | Installs dependencies and pre-downloads Chromium |
| **Start Command** | `npm start` | Starts the Express server |

---

## Step 3: Configure Environment Variables

Under the **Environment** tab of your new Web Service, add the following environment variables:

| Key | Value | Description |
| :--- | :--- | :--- |
| `PUPPETEER_CACHE_DIR` | `/opt/render/project/.cache/puppeteer` | **CRITICAL**: Tells Puppeteer where to download/find Chrome in a persistent location |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | `your_jwt_secret_here` | Secret key for signing JSON Web Tokens |
| `GOOGLE_GENAI_API_KEY` | `your_gemini_api_key_here` | Your Google Gemini AI API key |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` | (Optional) The URL of your deployed frontend to allow CORS |

---

## Step 4: Deploy

1. Click **Create Web Service** (or **Save Changes**).
2. Render will trigger the build. You should see in the build logs that it runs `npx puppeteer browsers install chrome` and downloads Chrome successfully.
3. Once the build finishes, the server will start and print `Server running on port <port>`.
