import { useState, useEffect } from 'react';
import { MenuBuilder } from './components/MenuBuilder';
import { TemplateSelection } from './components/TemplateSelection';
import { MenuPreview } from './components/MenuPreview';
import { Analytics } from './components/Analytics';
import { PublicMenu } from './components/PublicMenu';
import { LanguageProvider } from './contexts/LanguageContext';
import { MenuProvider } from './contexts/MenuContext';
import { Button } from './components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

// Import Icons
import { 
  Menu, 
  Utensils, 
  LayoutTemplate, 
  Eye, 
  BarChart3 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [showPublicView, setShowPublicView] = useState(false);
  
  // STATE DETEKSI LAYAR
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  return (
    <LanguageProvider>
      <MenuProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
          
          {/* HEADER (Akan scroll ke atas/hilang) */}
          <header className="bg-white border-b shadow-sm relative z-20">
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-500 to-yellow-500 p-2 rounded-lg">
                    <Menu className="size-5 md:size-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">MenuKu Digital</h1>
                    <p className="hidden md:block text-sm text-gray-600">Self-Service Digital Menu Builder</p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowPublicView(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Eye className="size-4" />
                  {isDesktop && <span>View Public Menu</span>}
                </Button>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-2 py-4 md:px-4 md:py-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
              
              {/* WRAPPER STICKY (SOLUSI FIX) */}
              {/* Kita bungkus TabsList dengan div sticky */}
              <div className="sticky top-0 z-30">
                <TabsList className="grid w-full grid-cols-4 h-14 md:h-12 bg-white/95 backdrop-blur shadow-md rounded-lg border border-gray-200/50 transition-all">
                  
                  <TabsTrigger value="builder" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 h-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 transition-all">
                    <Utensils className="h-5 w-5" />
                    {/* Teks Tab: Muncul mulai dari Tablet (md) */}
                    <span className="text-[10px] md:text-sm font-medium hidden md:inline">Builder</span>
                  </TabsTrigger>

                  <TabsTrigger value="template" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 h-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 transition-all">
                    <LayoutTemplate className="h-5 w-5" />
                    <span className="text-[10px] md:text-sm font-medium hidden md:inline">Template</span>
                  </TabsTrigger>

                  <TabsTrigger value="preview" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 h-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 transition-all">
                    <Eye className="h-5 w-5" />
                    <span className="text-[10px] md:text-sm font-medium hidden md:inline">Preview</span>
                  </TabsTrigger>

                  <TabsTrigger value="analytics" className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 h-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-900 transition-all">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-[10px] md:text-sm font-medium hidden md:inline">Analytics</span>
                  </TabsTrigger>

                </TabsList>
              </div>

              {/* AREA KONTEN */}
              <div className="pt-2">
                <TabsContent value="builder">
                  <MenuBuilder />
                </TabsContent>

                <TabsContent value="template">
                  <TemplateSelection />
                </TabsContent>

                <TabsContent value="preview">
                  <MenuPreview />
                </TabsContent>

                <TabsContent value="analytics">
                  <Analytics />
                </TabsContent>
              </div>
            </Tabs>
          </main>
        </div>
      </MenuProvider>
    </LanguageProvider>
  );
}