# 🎯 Panduan Lengkap: Fitur Drag & Drop Pengurutan Menu

## 📋 Daftar Isi
1. [Overview](#overview)
2. [Instalasi Dependencies](#instalasi-dependencies)
3. [Cara Menggunakan](#cara-menggunakan)
4. [Integrasi dengan Backend](#integrasi-dengan-backend)
5. [Customization](#customization)
6. [Troubleshooting](#troubleshooting)

---

## 🎨 Overview

Komponen `MenuSorter` adalah fitur drag & drop lengkap untuk mengatur urutan menu pada aplikasi Digital Menu Builder. Fitur ini menggunakan **@dnd-kit** (modern alternative dari React Beautiful DnD).

### ✨ Fitur Utama:
- ✅ Drag & Drop dengan animasi halus
- ✅ Cursor berubah menjadi "grab" saat drag
- ✅ Update state secara real-time
- ✅ Preview JSON urutan terbaru
- ✅ Fungsi `simpanUrutan()` untuk API integration
- ✅ UI modern berbasis card
- ✅ Responsive design
- ✅ Keyboard navigation support

---

## 📦 Instalasi Dependencies

Dependencies sudah terinstall di project ini. Jika belum, jalankan:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Note:** Dependencies sudah ada di `package.json` project ini.

---

## 🚀 Cara Menggunakan

### 1. Import Komponen

```tsx
import { MenuSorter } from './components/MenuSorter';
```

### 2. Gunakan di Halaman/Route

```tsx
import { MenuSorter } from './components/MenuSorter';

function MenuManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <MenuSorter />
    </div>
  );
}
```

### 3. Atau Tambahkan ke Tab di App.tsx

Edit `src/App.tsx`:

```tsx
import { MenuSorter } from './components/MenuSorter';

// Di dalam TabsList, tambahkan tab baru:
<TabsTrigger value="sorter" className="gap-2">
  <GripVertical className="size-4" />
  Urutkan Menu
</TabsTrigger>

// Di dalam TabsContent:
<TabsContent value="sorter" className="space-y-6">
  <MenuSorter />
</TabsContent>
```

---

## 🔌 Integrasi dengan Backend

### Fungsi `simpanUrutan()`

Fungsi ini sudah disiapkan dengan mock API. Untuk integrasi dengan backend real, edit bagian ini di `MenuSorter.tsx`:

```tsx
const simpanUrutan = async (): Promise<void> => {
  setIsSaving(true);

  try {
    // GANTI INI dengan endpoint backend Anda
    const response = await fetch('https://api-anda.com/menu/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN', // Jika perlu auth
      },
      body: JSON.stringify({
        items: menuItems.map((item) => ({
          id: item.id,
          order: item.order,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save order');
    }

    const data = await response.json();
    
    toast.success('Urutan menu berhasil disimpan!');
  } catch (error) {
    console.error('Error saving order:', error);
    toast.error('Gagal menyimpan urutan');
    throw error;
  } finally {
    setIsSaving(false);
  }
};
```

### Format Data yang Dikirim ke Backend

```json
{
  "items": [
    { "id": "1", "order": 0 },
    { "id": "2", "order": 1 },
    { "id": "3", "order": 2 }
  ]
}
```

### Contoh Response dari Backend

```json
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "updatedCount": 3
  }
}
```

---

## 🎨 Customization

### 1. Mengubah Data Awal (Load dari API/Context)

Edit fungsi `loadInitialData()` atau ganti dengan data dari context/API:

```tsx
// Option 1: Load dari MenuContext
import { useMenu } from '../contexts/MenuContext';

export function MenuSorter() {
  const { menuItems } = useMenu();
  
  // Convert MenuContext items ke format MenuSorter
  const [items, setItems] = useState<MenuItem[]>(() => {
    return menuItems.map((item, index) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
      order: item.order ?? index,
    }));
  });
  
  // ... rest of code
}
```

### 2. Mengubah Styling Card

Edit komponen `SortableMenuCard` di `MenuSorter.tsx`:

```tsx
// Ubah warna border saat drag
className={`
  ${isItemDragging ? 'border-blue-500' : 'border-gray-200'}
`}

// Ubah warna badge kategori
<span className="px-3 py-1 bg-orange-100 text-orange-700">
  {item.category}
</span>
```

### 3. Menambahkan Field Tambahan

Edit interface `MenuItem`:

```tsx
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  order: number;
  description?: string;  // Tambah field baru
  stock?: number;        // Tambah field baru
}
```

Lalu update komponen `SortableMenuCard` untuk menampilkan field baru.

---

## 🐛 Troubleshooting

### Problem: Drag tidak bekerja
**Solusi:**
- Pastikan `activationConstraint.distance` tidak terlalu besar (default: 8px)
- Cek apakah ada elemen lain yang menghalangi event pointer
- Pastikan `touch-none` class ada di drag handle

### Problem: JSON tidak terupdate
**Solusi:**
- Pastikan `handleDragEnd` dipanggil dengan benar
- Cek console untuk error
- Pastikan state `menuItems` di-update dengan benar

### Problem: Gambar tidak muncul
**Solusi:**
- Pastikan URL gambar valid
- Cek CORS policy jika gambar dari external domain
- Gunakan fallback image jika URL gagal

### Problem: Cursor tidak berubah menjadi grab
**Solusi:**
- Pastikan class `cursor-grab active:cursor-grabbing` ada
- Cek CSS global tidak override cursor
- Pastikan `touch-none` class ada

---

## 📝 Contoh Penggunaan Lengkap

### Standalone Page

Buat file `src/pages/MenuSorterPage.tsx`:

```tsx
import { MenuSorter } from '../components/MenuSorter';

export default function MenuSorterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <MenuSorter />
      </div>
    </div>
  );
}
```

### Dengan MenuContext Integration

```tsx
import { MenuSorter } from '../components/MenuSorter';
import { useMenu } from '../contexts/MenuContext';

export function MenuSorterWithContext() {
  const { menuItems, reorderMenuItems } = useMenu();
  
  // Convert dan sync dengan MenuContext
  // ... (lihat bagian Customization)
  
  return <MenuSorter />;
}
```

---

## 🎯 API Reference

### Props (jika ingin membuat versi dengan props)

```tsx
interface MenuSorterProps {
  items?: MenuItem[];           // Data awal (optional)
  onOrderChange?: (items: MenuItem[]) => void;  // Callback saat urutan berubah
  onSave?: (items: MenuItem[]) => Promise<void>; // Custom save function
  showJsonPreview?: boolean;    // Tampilkan JSON preview (default: true)
}
```

---

## 📚 Resources

- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [React Beautiful DnD (Alternative)](https://github.com/atlassian/react-beautiful-dnd)
- [SortableJS (Vanilla JS Alternative)](https://sortablejs.github.io/Sortable/)

---

## ✅ Checklist Implementasi

- [x] Komponen MenuSorter dibuat
- [x] Drag & Drop functionality
- [x] Real-time JSON preview
- [x] Fungsi simpanUrutan() dengan mock API
- [x] UI modern dengan card design
- [x] Cursor grab animation
- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Documentation lengkap

---

**Selamat menggunakan! 🎉**

Jika ada pertanyaan atau issue, silakan buat issue di repository atau hubungi developer.

