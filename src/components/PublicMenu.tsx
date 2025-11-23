import { useEffect, useState } from 'react';
// Pastikan file MenuContext.tsx sudah dibuat di src/contexts/MenuContext.tsx
import { useMenu } from '../contexts/MenuContext';
// Import ikon dari lucide-react
import { ShoppingCart, ArrowLeft, Search, ChefHat, X } from 'lucide-react';
import { toast } from 'sonner';

// Tipe data untuk props
interface PublicMenuProps {
  onBack?: () => void;
}

export function PublicMenu({ onBack }: PublicMenuProps) {
  const { menuItems, settings, trackView, isLoading } = useMenu();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // State Bahasa (Lokal)
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    toast.success(`Bahasa diganti ke ${newLang === 'id' ? 'Indonesia' : 'English'}`);
  };
  
  useEffect(() => {
    trackView();
  }, []);

  const categories = ['All', ...new Set(menuItems.map((item) => item.category))];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === itemId);
      if (existing) {
        return prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: itemId, quantity: 1 }];
    });
    trackView(itemId);
    toast.success("Menu ditambahkan ke pesanan");
  };

  const cartTotal = cart.reduce((total, cartItem) => {
    const item = menuItems.find(i => i.id === cartItem.id);
    return total + (item ? item.price * cartItem.quantity : 0);
  }, 0);

  const formatCurrency = (amount: number) => {
    const currencyCode = (settings as any).currency || 'IDR';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleOrder = () => {
    if (cart.length === 0) return;

    let message = language === 'id' ? `Halo, saya ingin memesan:\n\n` : `Hello, I would like to order:\n\n`;
    cart.forEach(cartItem => {
      const item = menuItems.find(i => i.id === cartItem.id);
      if (item) {
        message += `${cartItem.quantity}x ${item.name} - ${formatCurrency(item.price * cartItem.quantity)}\n`;
      }
    });
    message += `\nTotal: ${formatCurrency(cartTotal)}`;

    const encodedMessage = encodeURIComponent(message);
    const phone = (settings as any).phoneNumber || '6281234567890';
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32"> {/* Padding bawah diperbesar */}
      
      {/* Floating Header */}
      <div className="bg-white shadow-md sticky top-0 z-20 transition-all">
        <div className="container mx-auto px-4 py-4"> {/* Padding header ditambah */}
          <div className="flex items-center gap-3 justify-between">
            
            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                {/* TOMBOL BACK: JUMBO */}
                {onBack && (
                <button 
                    onClick={onBack} 
                    className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors active:scale-95 touch-manipulation border border-transparent"
                    title="Kembali"
                >
                    <ArrowLeft className="h-7 w-7 text-gray-800" />
                </button>
                )}

                {/* Nama Restoran */}
                <div className="flex-1 overflow-hidden">
                <h1 className="text-xl font-bold text-gray-900 truncate leading-tight">
                    {(settings as any).restaurantName || "Menu Restoran"}
                </h1>
                <p className="text-sm text-gray-500 truncate hidden sm:block">
                    {language === 'id' ? 'Pilih menu favoritmu' : 'Choose your favorite menu'}
                </p>
                </div>
            </div>

            {/* GROUP TOMBOL KANAN */}
            <div className="flex items-center gap-3 shrink-0">
              {/* TOMBOL BAHASA */}
              <button 
                onClick={toggleLanguage}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm active:scale-95 touch-manipulation border border-gray-200"
              >
                {language === 'id' ? 'EN' : 'ID'}
              </button>

              {/* CART BUTTON */}
              <button 
                className="bg-orange-600 hover:bg-orange-700 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg relative transition-colors active:scale-95 touch-manipulation"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
            <input 
              type="text"
              placeholder={language === 'id' ? "Cari makanan..." : "Search food..."}
              className="w-full pl-12 pr-4 h-14 bg-gray-100 border-none rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 mt-5 no-scrollbar touch-pan-x">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-base font-medium whitespace-nowrap transition-all active:scale-95 touch-manipulation ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-200'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="container mx-auto px-4 py-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-16 w-16 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Menu tidak ditemukan</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                
                {/* Image Area */}
                <div className="aspect-video relative bg-gray-100">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ChefHat className="h-16 w-16 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/95 backdrop-blur-md shadow-md font-bold text-gray-900 px-4 py-2 rounded-full text-base">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2 line-clamp-2 min-h-[3.5rem]">
                      {item.name}
                    </h3>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wide text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                      {item.category}
                    </span>
                  </div>
                  
                  <p className="text-base text-gray-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tombol Tambah JUMBO (h-14 = 56px) */}
                  <button 
                    className="w-full h-14 rounded-2xl font-bold text-base transition-all active:scale-[0.98] touch-manipulation bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-orange-100 hover:border-orange-200 flex items-center justify-center gap-2 mt-auto" 
                    onClick={() => addToCart(item.id)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {language === 'id' ? 'Tambah Pesanan' : 'Add to Order'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-30 safe-area-bottom">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gray-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between active:scale-95 transition-transform touch-manipulation"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 border-gray-900">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-400 font-medium">
                  {language === 'id' ? 'Total Pembayaran' : 'Total Payment'}
                </p>
                <p className="text-2xl font-bold text-white leading-none mt-0.5">{formatCurrency(cartTotal)}</p>
              </div>
            </div>
            <div className="bg-white/10 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
              {language === 'id' ? 'Lihat' : 'View'}
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'id' ? 'Pesanan Anda' : 'Your Order'}
                    </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95">
                    <X className="w-7 h-7 text-gray-600" />
                </button>
            </div>
          
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 font-medium text-lg">Kosong</p>
                </div>
                ) : (
                cart.map((cartItem) => {
                    const item = menuItems.find(i => i.id === cartItem.id);
                    if (!item) return null;
                    return (
                    <div key={cartItem.id} className="flex justify-between items-center pb-4 border-b border-dashed border-gray-100 last:border-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-lg font-bold text-gray-700">
                                {cartItem.quantity}x
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                                <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                            </div>
                        </div>
                        <p className="font-bold text-gray-900 text-lg">{formatCurrency(item.price * cartItem.quantity)}</p>
                    </div>
                    );
                })
                )}
            </div>

            {cart.length > 0 && (
                <div className="p-6 bg-gray-50 border-t">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600 font-bold text-lg">Total</span>
                        <span className="font-bold text-3xl text-orange-600">{formatCurrency(cartTotal)}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={handleOrder} 
                            className="w-full h-16 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold text-xl shadow-xl shadow-green-200 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {language === 'id' ? 'Pesan via WhatsApp' : 'Order via WhatsApp'}
                        </button>
                        <button 
                            onClick={() => setCart([])} 
                            className="w-full h-14 rounded-2xl border-2 border-gray-200 font-bold text-gray-500 hover:bg-white active:scale-[0.98]"
                        >
                            Kosongkan
                        </button>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}