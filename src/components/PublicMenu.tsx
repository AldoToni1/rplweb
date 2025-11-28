import { useEffect, useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import {
  Globe,
  ShoppingCart,
  X,
  Plus,
  Minus,
  ArrowLeft,
  Moon,
  Sun,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  item: any;
  quantity: number;
}

export function PublicMenu({ onBack }: { onBack?: () => void }) {
  const { menuItems, settings, trackView, isLoading, error } = useMenu();
  const { language, setLanguage, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    trackView();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleItemClick = (itemId: string) => {
    trackView(itemId);
  };

  const categories = ['all', ...Array.from(new Set(menuItems.map((item) => item.category)))];

  const filteredItems =
    selectedCategory === 'all' ? menuItems : menuItems.filter((item) => item.category === selectedCategory);
  const sortedItems = [...filteredItems].sort((a, b) => a.order - b.order);

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.item.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.item.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((cartItem) =>
          cartItem.item.id === itemId ? { ...cartItem, quantity: cartItem.quantity + delta } : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  const totalAmount = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const sendWhatsAppOrder = (item?: any) => {
    let orderText: string;
    let total: number;

    if (item) {
      const itemName = language === 'id' ? item.name : item.nameEn || item.name;
      orderText = `1x ${itemName} - Rp ${item.price.toLocaleString('id-ID')}`;
      total = item.price;
    } else {
      orderText = cart
        .map(
          (cartItem) =>
            `${cartItem.quantity}x ${
              language === 'id' ? cartItem.item.name : cartItem.item.nameEn || cartItem.item.name
            } - Rp ${(cartItem.item.price * cartItem.quantity).toLocaleString('id-ID')}`
        )
        .join('\n');
      total = totalAmount;
    }

    const restaurantName =
      language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName;
    const message = `Halo ${restaurantName}, saya ingin memesan:\n\n${orderText}\n\nTotal: Rp ${total.toLocaleString(
      'id-ID'
    )}`;

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 flex font-sans ${
        darkMode ? 'bg-[#0f1115] text-gray-100' : 'bg-[#f8f9fc] text-slate-800'
      }`}
    >
      {/* LEFT SIDEBAR - CART */}
      <AnimatePresence>
        {showCart && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Cart Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`fixed md:relative left-0 top-0 bottom-0 w-full max-w-[380px] ${
                darkMode ? 'bg-[#121418] border-r border-gray-800' : 'bg-white border-r border-gray-200'
              } z-50 flex flex-col`}
            >
              {/* Cart Header */}
              <div className={`p-5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {t('Kembali', 'Back')}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowCart(false)}
                    className="md:hidden"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-3">
                    <ShoppingCart className={`size-12 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {t('Keranjang Anda kosong', 'Your cart is empty')}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.map((cartItem) => (
                      <div
                        key={cartItem.item.id}
                        className={`p-3 rounded-lg border ${
                          darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        {/* Item Header */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                              {language === 'id' ? cartItem.item.name : cartItem.item.nameEn || cartItem.item.name}
                            </p>
                            <p className="text-xs text-orange-500 font-bold mt-1">
                              Rp {cartItem.item.price.toLocaleString('id-ID')} / item
                            </p>
                          </div>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, -cartItem.quantity)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="size-4 text-red-500" />
                          </button>
                        </div>

                        {/* Quantity & Subtotal */}
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-2 rounded px-2 py-1.5 ${darkMode ? 'bg-gray-800' : 'bg-white border border-gray-300'}`}>
                            <button
                              onClick={() => updateQuantity(cartItem.item.id, -1)}
                              className={`p-0.5 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center">{cartItem.quantity}</span>
                            <button
                              onClick={() => updateQuantity(cartItem.item.id, 1)}
                              className={`p-0.5 rounded transition-colors ${
                                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                              }`}
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Rp {(cartItem.item.price * cartItem.quantity).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className={`p-5 border-t ${darkMode ? 'bg-[#121418] border-gray-800' : 'bg-white border-gray-100'}`}>
                  <div className="mb-4">
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {t('Subtotal', 'Subtotal')}
                    </p>
                    <p className="text-2xl font-bold text-orange-500 mt-1">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <Button
                    className="w-full h-11 rounded-lg text-sm font-bold bg-green-600 hover:bg-green-700 text-white mb-2"
                    onClick={() => {
                      sendWhatsAppOrder();
                      setShowCart(false);
                    }}
                  >
                    <MessageCircle className="size-4 mr-2" />
                    {t('Pesan via WhatsApp', 'Order via WhatsApp')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-lg text-sm"
                    onClick={() => setShowCart(false)}
                  >
                    {t('Bersihkan Keranjang', 'Clear Cart')}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`sticky top-4 z-40 mx-auto w-[95%] max-w-6xl rounded-2xl border backdrop-blur-xl transition-all duration-300 my-4 ${
            darkMode
              ? 'bg-gray-900/60 border-gray-800/40 shadow-2xl shadow-black/30'
              : 'bg-white/70 border-white/60 shadow-xl shadow-gray-300/40'
          }`}
        >
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Left */}
              <div className="flex items-center gap-3">
                {onBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className={`rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <ArrowLeft className="size-5" />
                  </Button>
                )}
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {language === 'id' ? settings.restaurantName : settings.restaurantNameEn || settings.restaurantName}
                </h1>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
                  className={`rounded-full px-3 text-xs sm:text-sm ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <Globe className="size-4 mr-1" />
                  <span className="hidden sm:inline">{language === 'id' ? 'ID' : 'EN'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  {darkMode ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5 text-indigo-600" />}
                </Button>

                {/* Cart Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCart(!showCart)}
                  className={`rounded-full relative ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <ShoppingCart className="size-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? t('Semua', 'All') : cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedItems.map((item) => (
                <Card
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                    darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Image */}
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className={`font-bold text-base mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      {language === 'id' ? item.name : item.nameEn || item.name}
                    </h3>

                    <p className={`text-xs mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {language === 'id' ? item.description : item.descriptionEn || item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-500">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>

                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                      >
                        <Plus className="size-4 mr-1" />
                        {t('Tambah', 'Add')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
