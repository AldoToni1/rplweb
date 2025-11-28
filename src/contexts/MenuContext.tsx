'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAllMenus, createMenu, updateMenu, deleteMenu } from '../lib/services/menuService';
import type { MenuItemWithPhotos } from '../lib/services/menuService';

// --- Tipe Data ---
export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  price: number;
  description: string;
  descriptionEn?: string;
  category: string;
  image?: string;
  photos?: string[];
  order: number;
  template?: string;
}

export interface MenuSettings {
  restaurantName: string;
  restaurantNameEn?: string;
  whatsappNumber: string;
  template: 'minimalist' | 'colorful' | 'elegant' | 'modern';
  // Field tambahan untuk kompatibilitas dengan kode UI lama
  openHours?: string;
  address?: ReactNode;
}

interface Analytics {
  totalViews: number;
  itemViews: Record<string, number>;
  lastViewed: string;
}

interface MenuContextType {
  menuItems: MenuItem[];
  settings: MenuSettings;
  analytics: Analytics;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'order'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  reorderMenuItems: (items: MenuItem[]) => Promise<void>;
  updateSettings: (settings: Partial<MenuSettings>) => void;
  trackView: (itemId?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// 🔑 STORAGE KEY UNTUK SETTINGS (hanya settings yang disimpan di localStorage)
const STORAGE_KEY_SETTINGS = 'menuKu_settings';
const STORAGE_KEY_ANALYTICS = 'menuKu_analytics';

// DEFAULT SETTINGS (akan digunakan jika localStorage kosong)
const DEFAULT_SETTINGS: MenuSettings = {
  restaurantName: 'Restaurant Name',
  restaurantNameEn: 'Restaurant Name',
  whatsappNumber: '628123456789',
  template: 'modern',
  openHours: '10:00 - 22:00',
  address: 'Your Restaurant Address',
};

export function MenuProvider({ children }: { children: ReactNode }) {
  // Load menu items dari Supabase (bukan dummy data)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Settings dari localStorage (user settings, bukan data menu)
  const [settings, setSettings] = useState<MenuSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    }
    return DEFAULT_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ANALYTICS);
      return saved
        ? JSON.parse(saved)
        : {
            totalViews: 0,
            itemViews: {},
            lastViewed: new Date().toISOString(),
          };
    }
    return {
      totalViews: 0,
      itemViews: {},
      lastViewed: new Date().toISOString(),
    };
  });

  // --- FETCH DATA DARI SUPABASE ---
  useEffect(() => {
    const loadMenusFromSupabase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const menus = await getAllMenus();
        setMenuItems(menus as MenuItem[]);
      } catch (err) {
        console.error('Error loading menus from Supabase:', err);
        setError('Gagal memuat menu dari database. Pastikan Supabase sudah dikonfigurasi dengan benar.');
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenusFromSupabase();
  }, []);

  // --- AUTO-SAVE: Simpan settings ke LocalStorage setiap kali berubah ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // --- AUTO-SAVE: Simpan analytics ke LocalStorage setiap kali berubah ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(analytics));
    }
  }, [analytics]);

  // --- SYNC ANTAR TAB: Biar Admin & Public View nyambung real-time ---
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_SETTINGS && event.newValue) {
        console.log('Syncing settings from other tab...');
        setSettings(JSON.parse(event.newValue));
      }
      if (event.key === STORAGE_KEY_ANALYTICS && event.newValue) {
        console.log('Syncing analytics from other tab...');
        setAnalytics(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- CRUD ACTIONS: SUPABASE BACKEND ---

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'order'>) => {
    try {
      setError(null);
      const newItem = await createMenu(item);
      setMenuItems((prev) => [...prev, newItem as MenuItem]);
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError('Gagal menambah menu ke database.');
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      setError(null);
      const updatedItem = await updateMenu(id, updates);
      setMenuItems((prev) => prev.map((item) => (item.id === id ? ({ ...updatedItem } as MenuItem) : item)));
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Gagal mengupdate menu di database.');
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      setError(null);
      await deleteMenu(id);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Gagal menghapus menu dari database.');
      throw err;
    }
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    try {
      setError(null);
      // Update urutan di Supabase (dengan order field)
      await Promise.all(items.map((item, index) => updateMenu(item.id, { ...item, order: index } as any)));
      setMenuItems(items);
    } catch (err) {
      console.error('Error reordering menu items:', err);
      setError('Gagal mengubah urutan menu di database.');
      throw err;
    }
  };

  const updateSettings = (updates: Partial<MenuSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const trackView = async (itemId?: string) => {
    try {
      // Update total views
      setAnalytics((prev) => ({
        ...prev,
        totalViews: prev.totalViews + 1,
        lastViewed: new Date().toISOString(),
        itemViews: itemId
          ? {
              ...prev.itemViews,
              [itemId]: (prev.itemViews[itemId] || 0) + 1,
            }
          : prev.itemViews,
      }));

      console.log('View tracked:', itemId || 'Overall');
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        settings,
        analytics,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        reorderMenuItems,
        updateSettings,
        trackView,
        isLoading,
        error,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
}
