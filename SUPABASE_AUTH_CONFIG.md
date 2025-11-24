# Configuration Guide - Supabase Authentication Setup

## Overview

Panduan lengkap untuk setup Supabase Authentication di project MenuKu Digital.

## Prerequisites

1. **Supabase Account**: https://app.supabase.com
2. **Active Supabase Project**
3. **Node.js 16+** installed
4. **npm** atau **yarn** package manager

## Step 1: Create Supabase Project

Jika belum punya project:

1. Go to https://app.supabase.com
2. Click "New project"
3. Fill in:
   - **Project name**: `menuku-digital`
   - **Database password**: [Generate strong password]
   - **Region**: [Pilih yang terdekat]
4. Click "Create new project"
5. Wait until project fully created (2-3 minutes)

## Step 2: Get API Credentials

1. Go to your project dashboard
2. Click "Settings" (gear icon) → "API"
3. Copy these values:
   - **Project URL** (di sebelah Project name)
   - **anon public** (di bawah "API keys")

Example format:
```
Project URL: https://xxxxxxxxxxxx.supabase.co
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Configure Environment Variables

1. **Go ke root project directory**
2. **Create `.env` file** (jika belum ada)
3. **Copy and paste:**

```env
VITE_SUPABASE_URL=https://your_project_id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Replace dengan credentials dari Step 2!**

### Example `.env` file:
```env
VITE_SUPABASE_URL=https://nbcdsxyzabc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iY2RzeHl6YWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MDUxNDMwNDgsImV4cCI6MTkyMDQyOTA0OH0
```

## Step 4: Enable Email/Password Authentication

1. **In Supabase Dashboard**, go to:
   - **Authentication** → **Providers**
2. Look for **Email** provider
3. Make sure it's **ENABLED** (toggle should be ON)
4. Config settings:
   - **Enable Email Confirmations**: Optional (untuk production, sebaiknya ON)
   - **Enable Rate Limiting**: ON (untuk security)
   - **Email templates**: Customize jika perlu

## Step 5: Configure Redirect URLs

**For Development (localhost):**

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:5173`
3. Add **Redirect URLs**:
   ```
   http://localhost:5173/login
   http://localhost:5173/admin
   http://localhost:5173
   ```

**For Production:**

Ganti URLs dengan production domain:
```
https://yourapp.com
https://yourapp.com/login
https://yourapp.com/admin
```

## Step 6: Install Dependencies

```bash
cd /path/to/project
npm install
```

Dependencies yang ditambah:
- `react-router-dom@^6.20.0`
- `@supabase/supabase-js@^2.43.5` (sudah ada)

## Step 7: Test Configuration

### 1. Start Dev Server
```bash
npm run dev
```

Server akan run di `http://localhost:5173`

### 2. Check Supabase Connection
- Open browser console (F12)
- Look for message: **"Connected to Supabase"** atau tidak ada warning tentang credentials

### 3. Try Register
1. Go to http://localhost:5173
2. Auto redirect ke login page
3. Click "Daftar di sini"
4. Fill form:
   - Email: `test@example.com`
   - Password: `TestPassword123`
   - Confirm: `TestPassword123`
5. Click "Daftar"
6. Check Supabase:
   - Go to **Authentication** → **Users**
   - Harusnya ada user baru dengan email `test@example.com`

### 4. Try Login
1. di login page
2. Masukkan email & password tadi
3. Click "Masuk"
4. Harusnya redirect ke /admin (Dashboard)
5. Email tampil di navbar

## Advanced Configuration

### Enable Email Verification

**Production Recommended!**

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **"Enable Email Confirmations"** ON
3. User harus verifikasi email sebelum bisa login

### Custom Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize verification & reset emails
3. Add branding, logo, custom text

### Password Reset

Bisa ditambah di future:
```typescript
const { data, error } = await supabase.auth.resetPasswordForEmail(email)
```

### Social Auth (Future)

Bisa integrate dengan:
- Google
- GitHub
- Discord
- Facebook
- Twitch

Setup di **Authentication** → **Providers**

## Environment Variable Best Practices

### `.env` File Structure

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service Role Key (JANGAN di frontend!)
# VITE_SUPABASE_SERVICE_ROLE=your_service_role_key
```

### `.env.local` vs `.env`

- **`.env`**: Default values (can commit)
- **`.env.local`**: Local overrides (JANGAN commit)
- **`.env.production`**: Production values (JANGAN commit)

### `.gitignore` Setup

```
# .gitignore
.env
.env.local
.env.production.local
```

**IMPORTANT:** Jangan pernah commit `.env` file dengan credentials!

## Deployment Configuration

### Vercel

1. Go to Vercel Dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Add:
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://your_project.supabase.co`
5. Add:
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `your_anon_key`
6. **Redeploy** project

### Netlify

1. Go to Netlify Site settings
2. **Build & deploy** → **Environment**
3. Add same environment variables
4. **Trigger new deploy**

### Other Platforms

Follow same pattern:
- Set environment variables di platform dashboard
- Restart/redeploy aplikasi
- Verify di production

## Troubleshooting

### Error: "Supabase credentials are not configured"

**Penyebab:** Environment variables tidak loaded

**Solusi:**
```bash
# 1. Pastikan .env file di root project (bukan di src/)
# 2. Restart dev server
npm run dev

# 3. Check file content
cat .env  # Linux/Mac
type .env # Windows
```

### Error: "Invalid Credentials"

**Penyebab:** URL atau key salah

**Solusi:**
1. Double-check di Supabase dashboard
2. Copy-paste ulang (hati-hati extra space)
3. Pastikan no typo
4. Try hardcode di supabase.ts untuk testing

### Error: "User already exists"

**Penyebab:** Email sudah terdaftar

**Solusi:**
- Gunakan email berbeda
- Atau login dengan password yang benar

### Error: "Email not confirmed"

**Penyebab:** Email verification diperlukan

**Solusi:**
- Verifikasi email dari link di inbox
- Atau disable email verification di Supabase settings

## Database Schema (Optional)

Jika ingin setup database tables untuk extended functionality:

### users_profile (example)

```sql
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  restaurant_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;
```

### Row Level Security Policy

```sql
CREATE POLICY "Users can read own profile"
  ON users_profile FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  USING (auth.uid() = id);
```

## Performance Optimization

### Session Caching

Supabase otomatis cache session 24 jam.

### Offline Support

Untuk offline support (future):
```typescript
// Install: supabase-js with sync
import { createClient } from '@supabase/supabase-js'
```

## Security Checklist

- ✅ Environment variables configured
- ✅ Email authentication enabled
- ✅ Redirect URLs configured
- ✅ Rate limiting enabled
- ✅ HTTPS untuk production
- ✅ Strong password policy
- ✅ Protected routes setup
- ✅ RLS policies (jika ada database)

## Monitoring & Logs

### Check Authentication Logs

1. Go to Supabase Dashboard
2. **Authentication** → **Logs**
3. Monitor:
   - Login attempts
   - Sign up attempts
   - Failed auth
   - Rate limit triggers

## Useful Links & Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Get Started](https://supabase.com/docs/guides/getting-started)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [React Router Docs](https://reactrouter.com/)
- [Vite Guide](https://vitejs.dev/guide/)

## Next Steps

1. ✅ Setup Supabase project
2. ✅ Configure credentials
3. ✅ Test authentication
4. ✅ Customize branding
5. ➡️ Add features (2FA, social auth, etc.)
6. ➡️ Deploy to production
7. ➡️ Monitor & optimize

## Support & Questions

Jika ada masalah:
1. Check error di browser console
2. Check Supabase logs
3. Review documentation ini
4. Check Supabase docs: https://supabase.com/docs
5. Contact Supabase support
