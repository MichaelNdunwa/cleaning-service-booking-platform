# Phase 2 Deployment Guide

This repository contains two deployable pieces:

- `frontend/` -> the Next.js app
- `backend/cleaning_booking/` -> a custom Odoo addon, not a standalone Odoo server

## 1. Frontend on Vercel

Create a Vercel project with:

- Framework preset: `Next.js`
- Root directory: `frontend`

Set these environment variables in Vercel:

- `ODOO_BASE_URL=https://your-odoo-domain.example.com`
- `NEXTAUTH_URL=https://your-frontend-domain.example.com`
- `NEXTAUTH_SECRET=<strong-random-secret>`
- `GOOGLE_CLIENT_ID=<google-oauth-client-id>`
- `GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>`

Notes:

- Leave `NEXT_PUBLIC_ODOO_API_URL` empty in production if you want the built-in rewrite in `frontend/next.config.ts` to proxy `/api/v1/*` through the frontend domain.
- If you later add a custom domain, update `NEXTAUTH_URL` to that final domain.

## 2. Odoo Backend

This repo does not include the full Odoo server. For production, deploy an Odoo 19 instance with PostgreSQL, then add this addon to the server's addons path:

- `backend/cleaning_booking`

Set the backend environment variable below so browser requests from the frontend domain are accepted:

- `CLEANING_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.example.com`

Use a comma-separated list if you want to allow both local development and production at the same time.

## 3. Google OAuth Settings

In Google Cloud Console, update the same OAuth client you used for local development.

Authorized JavaScript origins:

- `http://localhost:3000`
- `https://your-frontend-domain.example.com`

Authorized redirect URIs:

- `http://localhost:3000/api/auth/callback/google`
- `https://your-frontend-domain.example.com/api/auth/callback/google`

The production redirect URI must exactly match the frontend domain and callback path used by NextAuth.

## 4. Recommended Order

1. Deploy Odoo and confirm its base URL works.
2. Set `CLEANING_ALLOWED_ORIGINS` on the Odoo host.
3. Deploy the frontend to Vercel with the production env vars above.
4. Add the production Google origin and redirect URI.
5. Test Google sign-in and verify the user can call `/api/v1/auth/me`.

## 5. Hosting Choices

If you want the cheapest practical path:

- Frontend: Vercel
- Backend: Oracle Cloud Always Free if you want no monthly bill and are okay with more setup
- Backend alternative: Railway if you want simpler deployment and are okay with a small monthly cost (I don't think I will be using this alternative.)
