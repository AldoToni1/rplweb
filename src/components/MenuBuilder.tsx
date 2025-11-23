import { useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Pencil, 
  Loader2,
  X 
} from 'lucide-react';
import { toast } from 'sonner';

export function MenuBuilder() {
  const { menuItems, addMenuItem, deleteMenuItem, updateMenuItem, isLoading } = useMenu();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Main Course',
    image: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Main Course',
      image: ''
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      price: item.price.toString(),
      description: item.description,
      category: item.category,
      image: item.image || ''
    });
    setIsEditing(true);
    setEditingId(item.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const menuData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        image: formData.image
      };

      if (isEditing && editingId) {
        await updateMenuItem(editingId, menuData);
        toast.success('Menu berhasil diperbarui');
      } else {
        await addMenuItem(menuData);
        toast.success('Menu berhasil ditambahkan');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Gagal menyimpan menu');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await deleteMenuItem(id);
        toast.success('Menu dihapus');
      } catch (error) {
        toast.error('Gagal menghapus menu');
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* HEADER & TOMBOL TAMBAH (Layout Stacked di Mobile biar gak numpuk) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Daftar Menu</h2>
          <p className="text-sm text-gray-500 mt-1">{menuItems.length} Item tersedia</p>
        </div>
        
        {/* Tombol Tambah Menu: Besar & Jelas (48px height) */}
        <button 
          onClick={() => { resetForm(); setIsDialogOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 h-12 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 font-bold text-base"
        >
          <Plus className="h-6 w-6" />
          <span>Tambah Menu</span>
        </button>
      </div>

      {/* MODAL FORM (Pop-up) */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b bg-gray-50 shrink-0">
              <h3 className="text-lg font-bold text-gray-900">
                {isEditing ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h3>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-200 p-2 rounded-full transition-colors shadow-sm border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Modal Body (Form Scrollable) */}
            <div className="overflow-y-auto p-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-700">Nama Menu</label>
                  <input 
                    id="name" 
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                    placeholder="Contoh: Nasi Goreng Spesial" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-semibold text-gray-700">Harga (Rp)</label>
                    <input 
                      id="price" 
                      type="number" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                      placeholder="25000" 
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-semibold text-gray-700">Kategori</label>
                    <div className="relative">
                      <select 
                        value={formData.category} 
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base appearance-none bg-white"
                      >
                        <option value="Main Course">Main Course</option>
                        <option value="Appetizer">Appetizer</option>
                        <option value="Dessert">Dessert</option>
                        <option value="Beverage">Beverage</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-semibold text-gray-700">URL Gambar</label>
                  <div className="flex gap-3">
                    <input 
                      id="image" 
                      type="text"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                      placeholder="https://..." 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                    />
                    <div className="w-12 h-12 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = '')} />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-gray-700">Deskripsi</label>
                  <textarea 
                    id="description" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base min-h-[100px]"
                    placeholder="Deskripsi singkat menu..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 mb-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Menyimpan...
                    </>
                  ) : (
                    isEditing ? 'Simpan Perubahan' : 'Tambah Menu'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        </div>
      ) : menuItems.length === 0 ? (
        // Empty State (Jumbo)
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-300 mx-4">
          <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-10 w-10 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Belum ada menu</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">Mulai tambahkan menu makananmu sekarang.</p>
        </div>
      ) : (
        // Menu Grid List
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all overflow-hidden shadow-sm">
              <div className="flex p-4 gap-4 items-center">
                {/* Image Thumbnail (Lebih Besar) */}
                <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-24">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate text-lg leading-tight">{item.name}</h3>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100">
                      {item.category}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-base font-bold text-gray-900">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    
                    {/* Action Buttons (Diperbesar) */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}