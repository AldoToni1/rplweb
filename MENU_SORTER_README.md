# 🎯 MenuSorter - Drag & Drop Pengurutan Menu

## ⚡ Quick Start

### 1. Import dan Gunakan

```tsx
import { MenuSorter } from './components/MenuSorter';

function YourPage() {
  return <MenuSorter />;
}
```

### 2. Atau Tambahkan ke App.tsx

Tambahkan tab baru di `src/App.tsx`:

```tsx
import { MenuSorter } from './components/MenuSorter';
import { GripVertical } from 'lucide-react';

// Di TabsList:
<TabsTrigger value="sorter">
  <GripVertical className="size-4" />
  Urutkan Menu
</TabsTrigger>

// Di TabsContent:
<TabsContent value="sorter">
  <MenuSorter />
</TabsContent>
```

## 🎨 Fitur

✅ Drag & Drop dengan animasi halus  
✅ Cursor grab saat drag  
✅ Real-time JSON preview  
✅ Fungsi `simpanUrutan()` untuk API  
✅ UI modern berbasis card  
✅ Responsive design  

## 📝 Integrasi Backend

Edit fungsi `simpanUrutan()` di `MenuSorter.tsx`:

```tsx
const response = await fetch('YOUR_API_ENDPOINT', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: menuItems.map(item => ({ id: item.id, order: item.order }))
  })
});
```

## 📚 Dokumentasi Lengkap

Lihat `DRAG_DROP_MENU_GUIDE.md` untuk dokumentasi lengkap.

## 🚀 Demo

Jalankan aplikasi dan buka tab "Urutkan Menu" atau akses langsung komponen `MenuSorter`.

---

**Siap digunakan! 🎉**

