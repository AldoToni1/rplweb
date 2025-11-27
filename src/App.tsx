import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuProvider } from './contexts/MenuContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { PublicMenu } from './components/PublicMenu';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <MenuProvider>
          <Routes>
            {/* Public Menu - Halaman pertama yang muncul */}
            <Route path="/public" element={<PublicMenu />} />
            <Route path="/" element={<Navigate to="/public" replace />} />

            {/* Login Page - Untuk akses dashboard */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard - Hanya untuk yang sudah login */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all - Redirect ke public */}
            <Route path="*" element={<Navigate to="/public" replace />} />
          </Routes>
        </MenuProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
