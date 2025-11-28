import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MenuProvider } from './contexts/MenuContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import { Register } from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import { PublicMenu } from './components/PublicMenu';
<<<<<<< HEAD
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuProvider } from './contexts/MenuContext';
import { CartProvider } from './contexts/cartcontext';
=======
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3

export default function App() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  return (
    <AuthProvider>
<<<<<<< HEAD
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
=======
      <LanguageProvider>
        <MenuProvider>
          <Routes>
            {/* Public Menu Route - Initial Display */}
            <Route path="/public" element={<PublicMenu />} />
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3

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

<<<<<<< HEAD
        {/* Default route - redirect to public */}
        <Route path="/" element={<Navigate to="/public" replace />} />

        {/* Catch all - redirect to public */}
        <Route path="*" element={<Navigate to="/public" replace />} />
      </Routes>
=======
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default route - redirect to public menu */}
            <Route path="/" element={<Navigate to="/public" replace />} />

            {/* Catch all - redirect to public menu */}
            <Route path="*" element={<Navigate to="/public" replace />} />
          </Routes>
        </MenuProvider>
      </LanguageProvider>
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3
    </AuthProvider>
  );
}
