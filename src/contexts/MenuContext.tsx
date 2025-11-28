'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  order: number;
  template?: string;
}

export interface MenuSettings {
  restaurantName: string;
  restaurantNameEn?: string;
  whatsappNumber: string;
  template: 'minimalist' | 'colorful' | 'elegant' | 'modern';
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

const STORAGE_KEY_ITEMS = 'menuKu_items'; // Key khusus untuk items
const STORAGE_KEY_SETTINGS = 'menuKu_settings';

// 🔥 DATA DUMMY DEFAULT
const DUMMY_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    nameEn: 'Special Fried Rice',
    price: 25000,
    description: 'Nasi goreng dengan telur, ayam suwir, dan kerupuk',
    descriptionEn: 'Fried rice with egg, shredded chicken, and crackers',
    category: 'Makanan Utama',
    image: 'https://images.unsplash.com/photo-1603133872878-684f571d70f2?w=400&h=400&fit=crop',
    order: 0,
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    nameEn: 'Chicken Noodle with Meatball',
    price: 18000,
    description: 'Mie ayam jamur dengan tambahan bakso sapi asli',
    descriptionEn: 'Mushroom chicken noodles with real beef meatballs',
    category: 'Makanan Utama',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=400&fit=crop',
    order: 1,
  },
  {
    id: '3',
    name: 'Es Teh Manis',
    nameEn: 'Sweet Iced Tea',
    price: 5000,
    description: 'Teh manis dingin segar',
    descriptionEn: 'Fresh sweet iced tea',
    category: 'Minuman',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
    order: 2,
  },
  {
    id: '4',
    name: 'Sate Ayam Madura',
    nameEn: 'Chicken Satay',
    price: 30000,
    description: '10 tusuk sate ayam dengan bumbu kacang khas Madura',
    descriptionEn: '10 skewers of chicken satay with Madura peanut sauce',
    category: 'Makanan Utama',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
    order: 3,
  },
  {
    id: '5',
    name: 'Kopi Susu Gula Aren',
    nameEn: 'Palm Sugar Coffee Latte',
    price: 18000,
    description: 'Kopi susu kekinian dengan gula aren asli',
    descriptionEn: 'Modern milk coffee with real palm sugar',
    category: 'Kopi',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop',
    order: 4,
  },
];

export function MenuProvider({ children }: { children: ReactNode }) {
  // 1. State Awal
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DUMMY_MENU_ITEMS);
  const [settings, setSettings] = useState<MenuSettings>({
    restaurantName: 'DSAI Kitchen',
    restaurantNameEn: 'DSAI Kitchen',
    whatsappNumber: '628123456789',
    template: 'modern',
  });
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading true
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 1250,
    itemViews: {},
    lastViewed: new Date().toISOString(),
  });

  // 2. LOAD DATA (Initial Mount)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Coba load dari LocalStorage
      const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
      const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

      if (storedItems) {
        try {
          const parsedItems = JSON.parse(storedItems);
          if (Array.isArray(parsedItems) && parsedItems.length > 0) {
            setMenuItems(parsedItems);
          }
        } catch (e) {
          console.error("Error parsing menu items", e);
        }
      }

      if (storedSettings) {
        try {
           setSettings(JSON.parse(storedSettings));
        } catch (e) {
           console.error("Error parsing settings", e);
        }
      }
      
      setIsLoading(false);
    }
  }, []);

  // 🔥 3. SYNC ANTAR TAB (Storage Event Listener)
  // Ini kuncinya! Agar kalau tab Admin update, tab Public ikut update
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_ITEMS && event.newValue) {
        console.log("Syncing menu items from another tab...");
        setMenuItems(JSON.parse(event.newValue));
      }
      if (event.key === STORAGE_KEY_SETTINGS && event.newValue) {
        console.log("Syncing settings from another tab...");
        setSettings(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  // 4. CRUD Logic (Save to LocalStorage)
  const saveToStorage = (items: MenuItem[]) => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    // Kita perlu manual trigger event agar tab yang SAMA juga tahu ada update (opsional untuk logic tertentu)
    // Tapi React state sudah handle tab yg sama.
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'order'>) => {
    const newItem = { ...item, id: Date.now().toString(), order: menuItems.length };
    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    saveToStorage(updated);
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map((item) => (item.id === id ? { ...item, ...updates } : item));
    setMenuItems(updated);
    saveToStorage(updated);
  };

  const deleteMenuItem = async (id: string) => {
    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    saveToStorage(updated);
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    setMenuItems(items);
    saveToStorage(items);
  };

  const updateSettings = (updates: Partial<MenuSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
  };

  const trackView = async (itemId?: string) => {
    console.log('View tracked:', itemId || 'Overall');
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
