# Quick Start - MenuKu Digital with Authentication

## Setup Environment Variables

Buat file `.env` di root project dengan konfigurasi berikut:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Mendapatkan Credentials dari Supabase

1. **Login ke Supabase Dashboard**: https://app.supabase.com
2. **Select your project** atau buat project baru
3. **Go to Settings** → **API**
4. Copy values:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `Anon public` → `VITE_SUPABASE_ANON_KEY`

## Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (buat .env file)
# Lihat bagian Setup Environment Variables di atas

# 3. Start development server
npm run dev

# Server akan running di http://localhost:5173
```

## Testing Aplikasi

### 1. Register Account Baru

```
1. Aplikasi akan redirect ke halaman login
2. Klik tombol "Daftar di sini" 
3. Isi form:
   - Email: [user@example.com]
   - Password: [Minimal 8 char, 1 uppercase, 1 number]
   - Konfirmasi Password: [Same as above]
4. Klik "Daftar"
5. Success → Auto redirect ke login page
```

**Contoh password yang valid:**
- `Password123`
- `MyMenu2025`
- `Admin@2025`

**Password yang invalid:**
- `password` (tidak ada uppercase)
- `PASSWORD` (tidak ada number)
- `Pass1` (kurang dari 8 char)

### 2. Login ke Dashboard

```
1. Masukkan email & password yang sudah terdaftar
2. Klik "Masuk"
3. Success → Redirect ke AdminDashboard (/admin)
4. Di navbar, lihat:
   - Email user
   - Tombol "Logout"
5. Akses semua fitur:
   - Menu Builder
   - Urutkan Menu
   - Template Selection
   - Menu Preview
   - Analytics
   - View Public Menu
```

### 3. Logout

```
1. Klik tombol "Logout" di navbar (kanan atas)
2. Session cleared
3. Auto redirect ke login page (/login)
4. Untuk login lagi, ulangi step 2
```

### 4. Protected Route Testing

```
1. Logout dari dashboard
2. Buka direktly: http://localhost:5173/admin
3. Otomatis redirect ke: http://localhost:5173/login
4. Tidak bisa akses admin tanpa login
```

## Project Structure

```
src/
├── contexts/
│   ├── AuthContext.tsx          # Auth state management
│   ├── LanguageContext.tsx      # Existing
│   └── MenuContext.tsx          # Existing
├── components/
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Register page
│   ├── ProtectedRoute.tsx        # Auth middleware
│   ├── AdminDashboard.tsx        # Main dashboard
│   ├── MenuBuilder.tsx           # Existing
│   ├── Analytics.tsx             # Existing
│   └── ...others
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── services/                # API services
├── App.tsx                       # Routing setup
├── main.tsx                      # React Router wrapper
└── index.css                     # Global styles
```

## Available Routes

| Route | Description | Protection |
|-------|-------------|-----------|
| `/login` | Login page | Public |
| `/register` | Register page | Public |
| `/admin` | Admin dashboard | Protected ✅ |
| `/` | Root (redirect to `/admin`) | - |

## Authentication Flow

### Sign Up (Register)
```
POST /auth/v1/signup → Supabase
↓
Validation: email format, password strength
↓
Success: User created, email verification (optional)
↓
Auto redirect to login
```

### Sign In (Login)
```
POST /auth/v1/token → Supabase
↓
Validation: email & password match
↓
Success: Session created, stored in localStorage
↓
Auto redirect to /admin
```

### Protected Routes
```
User request /admin
↓
ProtectedRoute check: isAuthenticated?
↓
Yes: Show AdminDashboard
No: Redirect to /login
```

## Troubleshooting

### Masalah: "Credentials are not configured"

**Solusi:**
- Cek `.env` file di root project (bukan di src/)
- Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah diisi
- Restart dev server setelah update `.env`

### Masalah: Login gagal dengan error "Invalid Credentials"

**Solusi:**
- Pastikan email & password benar
- Cek apakah user sudah terdaftar
- Pastikan email terverifikasi (jika authentication email confirmation enabled)

### Masalah: Session hilang setelah refresh page

**Solusi:**
- Session disimpan di localStorage, harusnya persist
- Clear localStorage dan login ulang
- Check browser's Application → Storage → Local Storage

### Masalah: Redirect loop (login → admin → login)

**Solusi:**
- Pastikan Supabase credentials correct
- Check console untuk error messages
- Coba clear localStorage dan cookies
- Restart dev server

## Build untuk Production

```bash
# Build optimized bundle
npm run build

# Output akan di folder 'build/'
# File siap di-deploy ke Vercel, Netlify, etc.
```

## Environment Variables untuk Production

Jangan hardcode credentials! Set di platform hosting:

**Vercel:**
```
Settings → Environment Variables
→ VITE_SUPABASE_URL
→ VITE_SUPABASE_ANON_KEY
```

**Netlify:**
```
Site settings → Build & deploy → Environment
→ VITE_SUPABASE_URL
→ VITE_SUPABASE_ANON_KEY
```

## Security Notes

✅ **Security Features:**
- Password hashed di Supabase (bcrypt)
- Session stored securely
- HTTPS required untuk production
- Environment variables protected
- Protected routes middleware
- Email validation

⚠️ **Best Practices:**
- Jangan commit `.env` file
- Rotate API keys secara berkala
- Monitor authentication logs
- Update dependencies regularly
- Use strong passwords

## Useful Links

- Supabase Docs: https://supabase.com/docs
- Supabase Auth: https://supabase.com/docs/guides/auth
- React Router: https://reactrouter.com/
- Vite: https://vitejs.dev/

## Support

Untuk bantuan lebih lanjut:
1. Check `AUTH_IMPLEMENTATION.md` untuk detail teknis
2. Review code di `src/contexts/AuthContext.tsx`
3. Check error messages di browser console
4. Konsultasi Supabase documentation
