import React, { useState } from 'react';
import { MenuBuilder } from './components/MenuBuilder';
import { TemplateSelection } from './components/TemplateSelection';
import { MenuPreview } from './components/MenuPreview';
import { Analytics } from './components/Analytics';
import { PublicMenu } from './components/PublicMenu';
import { MenuSorter } from './components/MenuSorter';
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuProvider } from './contexts/MenuContext';
import { LayoutDashboard, Eye, BarChart3, Palette, Menu, GripVertical } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [showPublicView, setShowPublicView] = useState(false);

  // Check if we're in public view mode (via URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  const isPublicView = urlParams.get('view') === 'public';

  if (isPublicView || showPublicView) {
    return (
      <LanguageProvider>
        <MenuProvider>
          <PublicMenu onBack={() => setShowPublicView(false)} />
        </MenuProvider>
      </LanguageProvider>
    );
  }

  // All navigation items - semua sejajar horizontal
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50" style={{ isolation: 'auto' }}>
          {/* Modern Navbar - Semua Menu Sejajar Horizontal - TIDAK ADA SIDEBAR VERTIKAL */}
          <header className="bg-white border-b shadow-sm sticky top-0 z-[100]" style={{ pointerEvents: 'auto' }}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Logo & Brand */}
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                    <Menu className="size-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">MenuKu Digital</h1>
                    <p className="text-sm text-gray-600 hidden sm:block">Self-Service Digital Menu Builder</p>
                  </div>
                </div>

                {/* Navigation - SELALU HORIZONTAL, TIDAK ADA VERSI VERTICAL */}
                <nav 
                  className="flex items-center gap-1 relative z-[101] overflow-x-auto overflow-y-hidden" 
                  style={{ 
                    flexDirection: 'row', 
                    flexWrap: 'nowrap',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {/* Semua Menu Items Sejajar Horizontal - TIDAK ADA FLEX-COL */}
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
                            flexWrap: 'nowrap'
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
                      onClick={() => setShowPublicView(true)}
                      variant="outline"
                      size="sm"
                      className="gap-2 ml-2 relative z-[102] flex-shrink-0"
                      style={{ 
                        pointerEvents: 'auto', 
                        display: 'flex', 
                        flexDirection: 'row',
                        flexWrap: 'nowrap'
                      }}
                    >
                      <Eye className="size-4" />
                      <span className="hidden sm:inline">View Public</span>
                      <span className="sm:hidden">View</span>
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            {/* Content berdasarkan activeTab - tidak ada TabsList */}
            {activeTab === 'builder' && (
              <div className="space-y-6">
                <MenuBuilder />
              </div>
            )}
            {activeTab === 'sorter' && (
              <div className="space-y-6">
                <MenuSorter />
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
      </MenuProvider>
    </LanguageProvider>
  );
}
