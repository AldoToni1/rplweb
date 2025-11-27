# Routing Structure - Version Final

## Route Mapping

| URL          | Akses     | Deskripsi                               |
| ------------ | --------- | --------------------------------------- |
| `/public`    | Public    | Halaman menu untuk public (tanpa login) |
| `/`          | Public    | Auto redirect ke `/public`              |
| `/login`     | Public    | Halaman login admin                     |
| `/dashboard` | Protected | Admin dashboard (hanya setelah login)   |
| Lainnya      | Public    | Auto redirect ke `/public`              |

## Login Flow

```
User membuka aplikasi
    ↓
/public muncul (Menu publik)
    ↓
User klik "Login Admin"
    ↓
/login page
    ↓
Input email & password
    ↓
✓ Benar → /dashboard (Admin Dashboard)
✗ Salah → Error message, tetap di /login
```

## Protected Routes

**ProtectedRoute Component:**

- Cek apakah user sudah login via `AuthContext`
- Jika belum → Redirect ke `/login`
- Jika sudah → Render dashboard

## Auto Redirect Logic

### Di Login Page:

- Jika user **sudah login** → Auto redirect ke `/dashboard`
- Jika user **belum login** → Tampilkan form login

### Di Dashboard:

- Jika user **logout** → Redirect ke `/login`
- Jika user **session expired** → ProtectedRoute redirect ke `/login`

## Testing Routes

```bash
# 1. Test public route
curl http://localhost:5173/public
# → Tampil menu public ✓

# 2. Test login
curl http://localhost:5173/login
# → Tampil form login ✓

# 3. Test dashboard tanpa login
curl http://localhost:5173/dashboard
# → Redirect ke /login ✓

# 4. Test default route
curl http://localhost:5173/
# → Redirect ke /public ✓

# 5. Test invalid route
curl http://localhost:5173/invalid
# → Redirect ke /public ✓
```

## Implementation

### App.tsx

```tsx
<Routes>
  <Route path="/public" element={<PublicMenu />} />
  <Route path="/" element={<Navigate to="/public" replace />} />
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard/*"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />
  <Route path="*" element={<Navigate to="/public" replace />} />
</Routes>
```

### Login.tsx - Auto Redirect

```tsx
useEffect(() => {
  if (isAuthenticated && !authLoading) {
    navigate('/dashboard', { replace: true });
  }
}, [isAuthenticated, authLoading, navigate]);
```

### ProtectedRoute.tsx - Protection

```tsx
if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

## Key Features

✅ **Public Menu Accessible** - Semua orang bisa lihat menu
✅ **Protected Admin** - Hanya login user bisa akses dashboard
✅ **Auto Redirect** - Smart redirect based on auth state
✅ **Session Persistence** - Login tetap bertahan saat refresh
✅ **Logout Support** - Clear session dan redirect ke login

## Security Notes

- Dashboard hanya accessible setelah successful login
- Session stored secara aman oleh Supabase
- Expired sessions auto-redirect ke login
- No signup feature - fixed credentials only
- Logout clears all session data
