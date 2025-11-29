import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './styles/drag-drop-fix.css';

// ✅ Cleanup on startup: Remove oversized/stale localStorage data
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('menuKu_items');

    // If contains base64 images or is oversized, clear it
    if (stored && (stored.includes('data:image/') || stored.length > 300000)) {
      console.warn('⚠️ Clearing oversized/base64 localStorage data on startup...');
      localStorage.removeItem('menuKu_items');
    }
  } catch (err) {
    console.error('Error cleaning localStorage at startup:', err);
  }
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>
);
