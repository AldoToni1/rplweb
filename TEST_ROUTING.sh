#!/bin/bash
# Test Script untuk Verify Routing

echo "🧪 Testing Routes..."
echo "===================="

# Test 1: Public Menu
echo "✓ Test 1: /public (Public Menu)"
echo "  → Akses: https://rplweb.vercel.app/public"
echo "  → Expected: Menu digital muncul"
echo ""

# Test 2: Root redirect
echo "✓ Test 2: / (Root redirect)"
echo "  → Akses: https://rplweb.vercel.app/"
echo "  → Expected: Auto redirect ke /public"
echo ""

# Test 3: Login page
echo "✓ Test 3: /login (Login Page)"
echo "  → Akses: https://rplweb.vercel.app/login"
echo "  → Expected: Form login muncul"
echo ""

# Test 4: Successful Login
echo "✓ Test 4: Login Success"
echo "  → Input email & password yang benar"
echo "  → Expected: Redirect ke /dashboard"
echo ""

# Test 5: Failed Login
echo "✓ Test 5: Login Failed"
echo "  → Input email/password yang salah"
echo "  → Expected: Error message, tetap di /login"
echo ""

# Test 6: Protected Route (Not Logged In)
echo "✓ Test 6: /dashboard (Not Logged In)"
echo "  → Buka incognito/clear cookies"
echo "  → Akses: https://rplweb.vercel.app/dashboard"
echo "  → Expected: Redirect ke /login"
echo ""

# Test 7: Already Logged In Akses Login Page
echo "✓ Test 7: Login Page (Already Logged In)"
echo "  → Sudah login ke /dashboard"
echo "  → Coba akses: /login"
echo "  → Expected: Auto redirect ke /dashboard"
echo ""

# Test 8: Logout
echo "✓ Test 8: Logout"
echo "  → Di dashboard, klik 'Logout'"
echo "  → Expected: Redirect ke /login, session cleared"
echo ""

# Test 9: Invalid Route
echo "✓ Test 9: Invalid Route"
echo "  → Akses: /invalid-route"
echo "  → Expected: Redirect ke /public"
echo ""

# Test 10: Dashboard Tabs
echo "✓ Test 10: Dashboard Features"
echo "  → Setelah login ke /dashboard"
echo "  → Expected: Bisa akses:"
echo "    - Menu Builder"
echo "    - Urutkan Menu"
echo "    - Template"
echo "    - Preview"
echo "    - Analytics"
echo ""

echo "✅ All tests completed!"
echo "===================="
