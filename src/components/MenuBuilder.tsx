"use client";
import React, { useState } from 'react';
import { useMenu } from '../contexts/MenuContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Pencil, Trash2, GripVertical, Loader, Upload, X } from 'lucide-react';


import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { MenuItem } from '../contexts/MenuContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';


interface MenuItemFormData {
  name: string;
  nameEn: string;
  price: string;
  description: string;
  descriptionEn: string;
  category: string;
  image: string;
}

function SortableMenuItem({ item, onEdit, onDelete }: { item: MenuItem; onEdit: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 relative">
      <div className="flex items-start gap-4">
        <button 
          className="mt-2 cursor-grab active:cursor-grabbing touch-none flex-shrink-0" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="size-5 text-gray-400" />
        </button>

        {item.image && (
          <div className="flex-shrink-0">
            <ImageWithFallback 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-lg" 
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
              {item.nameEn && <p className="text-sm text-gray-500 truncate">{item.nameEn}</p>}
              <p className="text-orange-600 font-semibold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                <Trash2 className="size-4 text-red-500" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
          {item.descriptionEn && <p className="text-sm text-gray-500 mt-1 italic line-clamp-2">{item.descriptionEn}</p>}
          <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
            {item.category}
          </span>
        </div>
      </div>
    </Card>
  );
}

export function MenuBuilder() {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems, isLoading, error } = useMenu();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: '',
    nameEn: '',
    price: '',
    description: '',
    descriptionEn: '',
    category: '',
    image: '',
  });

  // const sensors = useSensors(
  //   useSensor(PointerSensor),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // WAJIB BIAR DRAG BISA AKTIF
    },
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

  const categories = Array.from(new Set(menuItems.map((item) => item.category))).filter(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      nameEn: formData.nameEn || undefined,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      descriptionEn: formData.descriptionEn || undefined,
      category: formData.category,
      image: formData.image || undefined,
    };

    setIsSaving(true);

    const operation = editingItem ? updateMenuItem(editingItem.id, itemData) : addMenuItem(itemData);

    operation
      .then(() => {
        toast.success(editingItem ? 'Menu updated successfully' : 'Menu added successfully');
        setIsDialogOpen(false);
        resetForm();
      })
      .catch((err) => {
        toast.error(editingItem ? 'Failed to update menu' : 'Failed to add menu');
        console.error(err);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      price: '',
      description: '',
      descriptionEn: '',
      category: '',
      image: '',
    });
    setImagePreview(null);
    setEditingItem(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.');
      return;
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    // Convert ke Base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
    };
    reader.onerror = () => {
      toast.error('Gagal membaca file gambar.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameEn: item.nameEn || '',
      price: item.price.toString(),
      description: item.description,
      descriptionEn: item.descriptionEn || '',
      category: item.category,
      image: item.image || '',
    });
    // Set preview jika ada image (bisa URL atau Base64)
    setImagePreview(item.image || null);
    setIsDialogOpen(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = menuItems.findIndex((item) => item.id === active.id);
      const newIndex = menuItems.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(menuItems, oldIndex, newIndex);

      reorderMenuItems(reordered).catch((err) => {
        toast.error('Failed to reorder menu items');
        console.error(err);
      });
    }
  };

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
            <p className="text-sm text-gray-600 mt-1">Tambah, edit, atau drag untuk mengatur urutan menu</p>
            {error && <p className="text-sm text-red-600 mt-2">Warning: {error}</p>}
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open: boolean) => {
              setIsDialogOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={isLoading || isSaving}>
                <Plus className="size-4" />
                Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Tambah Menu Item Baru'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Menu (Indonesia) *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nasi Goreng"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nameEn">Nama Menu (English)</Label>
                    <Input
                      id="nameEn"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      placeholder="Fried Rice"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga (Rp) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="25000"
                      required
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Makanan Utama"
                      list="categories"
                      required
                      disabled={isSaving}
                    />
                    <datalist id="categories">
                      {categories.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi (Indonesia) *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nasi goreng spesial dengan telur, ayam, dan sayuran"
                    rows={3}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descriptionEn">Deskripsi (English)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Special fried rice with egg, chicken, and vegetables"
                    rows={3}
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-upload">Gambar Menu</Label>
                  
                  {/* File Input */}
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="image-upload"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-gray-50">
                        <Upload className="size-5 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">
                          {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar (JPG, PNG, max 5MB)'}
                        </span>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageUpload}
                        disabled={isSaving}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isSaving}
                        className="flex-shrink-0"
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative mt-3 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Format yang didukung: JPG, PNG. Maksimal ukuran: 5MB
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    disabled={isSaving}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader className="size-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>{editingItem ? 'Update' : 'Tambah'} Menu</>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">
            <Loader className="size-8 mx-auto mb-2 animate-spin" />
            <p>Loading menu items...</p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Belum ada menu item. Klik "Tambah Menu" untuk memulai.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedMenuItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 w-full">
                {sortedMenuItems.map((item) => (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    onEdit={() => handleEdit(item)}
                    onDelete={() => {
                      if (confirm(`Hapus "${item.name}" dari menu?`)) {
                        deleteMenuItem(item.id)
                          .then(() => toast.success(`${item.name} deleted`))
                          .catch((err) => {
                            toast.error('Failed to delete menu item');
                            console.error(err);
                          });
                      }
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>
    </div>
  );
}
