import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MenuBuilder } from './MenuBuilder';
import { TemplateSelection } from './TemplateSelection';
import { MenuPreview } from './MenuPreview';
import { Analytics } from './Analytics';
import MenuSorting from './MenuSorting';
import { LanguageProvider } from '../contexts/LanguageContext';
import { MenuProvider } from '../contexts/MenuContext';
// ✅ Ikon Lengkap
import { LayoutDashboard, Eye, BarChart3, Palette, Building2, GripVertical, LogOut, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Toaster } from './ui/sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('builder');
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

<<<<<<< HEAD
  const handleViewPublic = () => {
    // Navigate to public route in new tab
    window.open('/public', '_blank');
  };

  // All navigation items
=======
  const urlParams = new URLSearchParams(window.location.search);
  const isPublicView = urlParams.get('view') === 'public';

  // Navigasi Menu
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3
  const navItems = [
    { id: 'builder', label: 'Menu Builder', icon: LayoutDashboard },
    { id: 'sorter', label: 'Urutkan Menu', icon: GripVertical },
    { id: 'template', label: 'Template', icon: Palette },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <LanguageProvider>
      <MenuProvider>
        {/* TAMPILAN PUBLIC VIEW */}
        {isPublicView || showPublicView ? (
          <PublicMenu onBack={() => setShowPublicView(false)} />
        ) : (
          /* TAMPILAN ADMIN DASHBOARD */
          <div className="min-h-screen bg-gray-50/50 font-sans selection:bg-orange-100 selection:text-orange-900">
            {/* 1. HEADER (LOGO & USER INFO) */}
            {/* UPDATE: Menghapus 'sticky top-0 z-50'
                Sekarang header akan ikut ter-scroll ke atas (menghilang).
            */}
            <header className="bg-white border-b border-gray-200/80 backdrop-blur-sm">
              <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* KIRI: Logo */}
                <div className="flex items-center gap-4 transition-opacity hover:opacity-80 cursor-pointer">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20 ring-1 ring-black/5">
                    <Building2 className="size-6 text-white" />
                  </div>
                  <div className="leading-tight">
                    <h1 className="font-extrabold text-xl text-gray-900 tracking-tight">DSAI Kitchen</h1>
                    <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Admin Dashboard</p>
                  </div>
                </div>

<<<<<<< HEAD
                {/* Navigation - SELALU HORIZONTAL */}
                <nav
                  className="flex items-center gap-1 relative z-[101] overflow-x-auto overflow-y-hidden"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  {/* Menu Items */}
                  <div className="flex items-center gap-1 flex-row flex-nowrap min-w-max">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                            whitespace-nowrap relative z-[102] flex-shrink-0
                            ${
                              activeTab === item.id
                                ? 'bg-orange-100 text-orange-700 shadow-sm'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                            }
                          `}
                          style={{
                            pointerEvents: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                          }}
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          <span className="hidden lg:inline">{item.label}</span>
                          <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                        </button>
                      );
                    })}

                    {/* View Public Menu Button */}
                    <Button
                      onClick={handleViewPublic}
                      variant="outline"
                      size="sm"
                      className="gap-2 ml-2 relative z-[102] flex-shrink-0"
                      style={{
                        pointerEvents: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                      }}
                    >
                      <Eye className="size-4" />
                      <span className="hidden sm:inline">View Public</span>
                      <span className="sm:hidden">View</span>
                    </Button>

                    {/* User Info & Logout */}
                    <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                      <div className="hidden sm:flex flex-col items-end text-sm">
                        <p className="font-medium text-gray-700 truncate">{user?.email}</p>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="size-4" />
                        <span className="hidden sm:inline">Logout</span>
                      </Button>
                    </div>
=======
                {/* KANAN: User Actions */}
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end mr-2 animate-in fade-in slide-in-from-right-4 duration-700">
                    <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-0.5 leading-none block">
                      Login sebagai:
                    </span>
                    <span className="text-sm font-bold text-gray-800 max-w-[150px] truncate leading-none block">
                      {user?.email?.split('@')[0]}
                    </span>
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3
                  </div>

                  <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                  <Button
                    variant="outline"
                    className="hidden sm:flex gap-2 border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 font-medium h-10 px-5 rounded-full transition-all hover:shadow-md"
                    onClick={() => setShowPublicView(true)}
                  >
                    <ExternalLink className="size-4" />
                    <span className="hidden lg:inline">Lihat Menu</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 rounded-full transition-colors"
                    title="Keluar"
                  >
                    <LogOut className="size-5" />
                  </Button>
                </div>
              </div>
            </header>

            {/* 2. NAVBAR RESPONSIVE (Tombol Lebih Besar & Rapi) */}
            {/* UPDATE: Mengubah 'top-20' menjadi 'top-0' dan 'z-50'
                Sekarang Navbar ini akan menempel di paling atas layar saat di-scroll.
            */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/95">
              <div className="container mx-auto px-4">
                {/* Container Flex Rata Tengah dengan Padding Lebih Besar */}
                <nav className="flex justify-center items-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-5">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`
                          group flex items-center justify-center gap-2.5 px-7 py-3 rounded-full transition-all duration-300 ease-out whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
                          ${
                            isActive
                              ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 scale-105 font-bold'
                              : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200 font-medium hover:shadow-sm'
                          }
                        `}
                      >
                        <Icon
                          className={`size-5 transition-transform duration-300 ${
                            isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'
                          }`}
                        />
                        <span
                          className={`text-sm tracking-wide ${
                            isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* 3. KONTEN UTAMA (Dengan Animasi Masuk) */}
            <main className="container mx-auto px-4 py-8 max-w-6xl min-h-[calc(100vh-200px)]">
              {/* Wrapper animasi untuk konten */}
              <div
                key={activeTab} // Key ini penting agar animasi reset saat tab berubah
                className="animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out"
              >
                {activeTab === 'builder' && <MenuBuilder />}
                {activeTab === 'sorter' && <MenuSorter />}
                {activeTab === 'template' && <TemplateSelection />}
                {activeTab === 'preview' && <MenuPreview />}
                {activeTab === 'analytics' && <Analytics />}
              </div>
<<<<<<< HEAD
            )}
            {activeTab === 'sorter' && (
              <div className="space-y-6">
                <MenuSorting />
              </div>
            )}
            {activeTab === 'template' && (
              <div className="space-y-6">
                <TemplateSelection />
              </div>
            )}
            {activeTab === 'preview' && (
              <div className="space-y-6">
                <MenuPreview />
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <Analytics />
              </div>
            )}
          </main>
          <Toaster />
        </div>
=======
            </main>

            <Toaster />
          </div>
        )}
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3
      </MenuProvider>
    </LanguageProvider>
  );
}
