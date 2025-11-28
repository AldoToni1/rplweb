import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import { PublicMenu } from './components/PublicMenu';
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuProvider } from './contexts/MenuContext';
import { CartProvider } from './contexts/cartcontext';

export default function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  return (
    <AuthProvider>
      <Routes>
        {/* Public Route - Tampilan awal saat npm run dev */}
        <Route
          path="/public"
          element={
            <LanguageProvider>
              <MenuProvider>
                <CartProvider>
                  <PublicMenu />
                </CartProvider>
              </MenuProvider>
            </LanguageProvider>
          }
        />

        {/* Auth Routes - Login & Register Page */}
        <Route
          path="/login"
          element={
            authView === 'login' ? (
              <Login onSwitchToRegister={() => setAuthView('register')} />
            ) : (
              <Register onSwitchToLogin={() => setAuthView('login')} />
            )
          }
        />
        <Route path="/register" element={<Register onSwitchToLogin={() => setAuthView('login')} />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default route - redirect to public */}
        <Route path="/" element={<Navigate to="/public" replace />} />

        {/* Catch all - redirect to public */}
        <Route path="*" element={<Navigate to="/public" replace />} />
      </Routes>
    </AuthProvider>
  );
}
