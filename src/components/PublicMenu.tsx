import React, { useEffect, useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { CategoryChip } from './CategoryChip';
import { MenuCard } from './MenuCard';
import { Moon, Sun, Instagram, Facebook, MapPin, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from './ui/button';

// --- KONFIGURASI TEMA ---
const THEMES = {
  minimalist: {
    bg: 'bg-gray-50',
    header: 'bg-white border-b border-gray-200',
    headerText: 'text-gray-900',
    subText: 'text-gray-500',
    categoryBg: 'bg-white border-b border-gray-200',
    footer: 'bg-gray-900 text-white',
  },
  colorful: {
    bg: 'bg-orange-50/50',
    header: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-md',
    headerText: 'text-white',
    subText: 'text-orange-100',
    categoryBg: 'bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky',
    footer: 'bg-gradient-to-br from-orange-600 to-purple-700 text-white',
  },
  elegant: {
    bg: 'bg-stone-900',
    header: 'bg-stone-950 border-b border-stone-800',
    headerText: 'text-amber-500',
    subText: 'text-stone-400',
    categoryBg: 'bg-stone-950/90 backdrop-blur border-b border-stone-800',
    footer: 'bg-black text-amber-500 border-t border-stone-800',
  },
  modern: {
    bg: 'bg-slate-50',
    header: 'bg-blue-600 text-white shadow-lg',
    headerText: 'text-white',
    subText: 'text-blue-100',
    categoryBg: 'bg-white shadow-sm border-b border-blue-100',
    footer: 'bg-slate-800 text-white',
  },
};

export function PublicMenu({ onBack }: { onBack?: () => void }) {
  const { menuItems, settings, trackView } = useMenu();
  const { language, setLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Default ke 'minimalist' jika setting tidak ditemukan
  const activeTheme = THEMES[settings.template || 'minimalist'];

  useEffect(() => {
    trackView();
  }, []);

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'all' ? menuItems : menuItems.filter((item) => item.category === selectedCategory);

  // Sortir berdasarkan order
  const sortedItems = [...filteredItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleOrderClick = (item: any) => {
    const itemName = language === 'id' ? item.name : item.nameEn || item.name;
    const restaurantName =
      language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;
    const message =
      language === 'id'
        ? `Halo ${restaurantName}, saya ingin pesan ${itemName}.`
        : `Hello ${restaurantName}, I would like to order ${itemName}.`;
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    trackView(item.id);
  };

  const restaurantName =
    language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;

  const orderViaWhatsApp = language === 'id' ? 'Pesan via WhatsApp' : 'Order via WhatsApp';

  return (
    // 🔥 Terapkan Background Tema
    <div className={`min-h-screen transition-colors duration-300 ${activeTheme.bg}`}>
      
      {/* --- HEADER --- */}
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${activeTheme.header}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className={`flex items-center gap-2 transition-colors ${activeTheme.headerText} opacity-90 hover:opacity-100`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">{t('Kembali', 'Back')}</span>
                </button>
              )}
              <div className="flex flex-col">
                <h1 className={`text-lg sm:text-xl font-bold ${activeTheme.headerText}`}>
                  {restaurantName}
                </h1>
                {/* Bisa tambah tagline opsional di sini */}
                <span className={`text-xs ${activeTheme.subText}`}>
                  {language === 'id' ? 'Menu Digital' : 'Digital Menu'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onLanguageChange={setLanguage} />
              {/* Tombol Share sederhana */}
              <button 
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))}
                className={`p-2 rounded-full bg-white/10 hover:bg-white/20 ${activeTheme.headerText}`}
              >
                <Share2 className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- CATEGORY TABS --- */}
      <section className={`sticky top-[68px] z-40 transition-colors duration-300 ${activeTheme.categoryBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const label = category === 'all' 
                ? (language === 'id' ? 'Semua' : 'All') 
                : category.charAt(0).toUpperCase() + category.slice(1); 

              return (
                <CategoryChip
                  key={category}
                  label={label}
                  isSelected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* --- MENU GRID --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24">
        {sortedItems.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-lg ${activeTheme.headerText} opacity-60`}>
              {t('Belum ada menu tersedia', 'No menu items available')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedItems.map((item) => {
              const itemName = language === 'id' ? item.name : item.nameEn || item.name;
              const itemDescription =
                language === 'id' ? item.description : item.descriptionEn || item.description;
              const price = `Rp ${item.price.toLocaleString('id-ID')}`;

              return (
                <MenuCard
                  key={item.id}
                  image={item.image || ''}
                  name={itemName || 'Menu Item'}
                  description={itemDescription || 'No description'}
                  price={price}
                  onOrderClick={() => handleOrderClick(item)}
                  whatsappLabel={orderViaWhatsApp}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className={`transition-colors duration-300 ${activeTheme.footer}`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{restaurantName}</h3>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 mt-1 opacity-80" />
                <div>
                  <p className="opacity-70 mb-1 text-sm">
                    {language === 'id' ? 'Jam Operasional' : 'Operational Hours'}
                  </p>
                  <p className="font-medium">
                    {language === 'id'
                      ? 'Senin - Minggu: 10:00 - 22:00'
                      : 'Monday - Sunday: 10:00 AM - 10:00 PM'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 opacity-80" />
                <div>
                  <p className="opacity-70 mb-1 text-sm">{language === 'id' ? 'Alamat' : 'Address'}</p>
                  <p className="font-medium">
                    {language === 'id' ? 'Jl. Kuliner Raya No. 123, Jakarta Selatan' : '123 Culinary Street, South Jakarta'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center opacity-60 text-sm">
            <p>&copy; 2025 {restaurantName}. Powered by DSAI Kitchen.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}