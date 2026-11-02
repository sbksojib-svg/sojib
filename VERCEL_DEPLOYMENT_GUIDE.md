# Vercel Secure Deployment Guide

This project is fully configured for zero-configuration or custom Vercel deployment with server-side authentication, protected admin APIs, and manual bKash/Nagad payment approvals.

---

## 🚀 Quick Deployment Methods

### Option 1: Deploy with Vercel CLI (Fastest)

1. Extract the downloaded ZIP file.
2. In your terminal, navigate to the folder:
   ```bash
   cd your-project-folder
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run Vercel deploy:
   ```bash
   npx vercel
   ```
   Follow the prompts to link or create a new project.
5. For production release:
   ```bash
   npx vercel --prod
   ```

---

### Option 2: Deploy with GitHub & Vercel Dashboard

1. Push this folder to a new repository on your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete video platform with super admin and payment approvals"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Set Framework Preset to **Vite** (Vercel automatically detects `vercel.json`).
5. **CRITICAL STEP**: Before clicking Deploy, configure your **Environment Variables** (see below).
6. Click **Deploy**!

---

## 🔐 Supabase + Vercel Environment Variables

Follow `SUPABASE_SETUP_BN.md` first. Required Vercel variables:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only secret; never expose in frontend)
- `ADMIN_EMAIL`
- `SESSION_SECRET` (random, at least 32 characters)
- `NODE_ENV=production`

The previous `ADMIN_PASSWORD` environment variable is no longer used. Create the admin user in Supabase Auth and explicitly add its UUID to `public.super_admins` as described in the setup guide.

**Data migration limitation:** this patch moves Super Admin credential verification to Supabase Auth and adds the persistent schema foundation. Existing student/video/payment API routes still use the in-memory store. Do not treat this as a completed migration of all application data to Supabase or rely on Vercel memory for production persistence.

---

## 🛠️ Verification Checklist After Deployment

1. **Visit your live URL**: `https://your-project.vercel.app`
2. **Access Super Admin**: Click the "Admin" lock button in the header or visit `/admin/login`.
3. **Attempt login with unauthorized email**: Notice the system denies access with `403 Forbidden: Only authorized Super Admin email sbksojib@gmail.com can log in`.
4. **Log in with authorized email**: Use `sbksojib@gmail.com` and your configured `ADMIN_PASSWORD`.
5. **Test Payment Flow**:
   - As a student, pick a premium video/course.
   - Select bKash or Nagad, enter sender number and Transaction ID (TrxID).
   - In Admin Dashboard, approve the payment in one click. Notice the student gets immediate access!
