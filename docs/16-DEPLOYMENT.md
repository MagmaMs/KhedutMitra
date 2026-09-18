# Deployment Guide

## 1. Frontend (Vercel)
The React/Vite app is optimized for Vercel.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_API_GATEWAY_URL`

## 2. Backend (Render)
The Express API Gateway is deployed to Render as a Web Service.
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:**
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY` (for AI advisory)

## 3. Database (Supabase)
- Hosted on Supabase Cloud.
- Migrations are managed locally via Supabase CLI and applied to the production project prior to the hackathon demo.
