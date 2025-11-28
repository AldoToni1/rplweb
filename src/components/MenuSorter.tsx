/**
 * 🎯 Komponen Drag & Drop "Pengurutan Menu"
 * * Update:
 * - Tampilan kartu SAMA PERSIS dengan Menu Builder (Gambar w-20, Deskripsi, dll).
 * - Terhubung ke MenuContext (Data Pusat) agar sinkron.
 */

'use client';

<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import { useState } from 'react';
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'; // Pastikan import CardContent ada
import { GripVertical, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// 👇 Import Context & Image Component
import { useMenu, MenuItem } from '../contexts/MenuContext'; 
import { ImageWithFallback } from './figma/ImageWithFallback';

// ============================================
// 1. KARTU MENU (Style SAMA dengan Menu Builder)
// ============================================
function SortableMenuCard({ item, isDragging = false }: { item: MenuItem; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isItemDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isItemDragging ? 0.5 : 1,
    zIndex: isItemDragging ? 50 : 'auto',
    position: 'relative' as 'relative',
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`p-4 relative ${isItemDragging ? 'border-orange-400 shadow-lg' : 'hover:shadow-md transition-shadow'}`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button 
          className="mt-2 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="size-5 text-gray-400" />
        </button>

        {/* 🖼️ GAMBAR: Ukuran disamakan dengan Menu Builder (w-20 h-20) */}
        {item.image ? (
          <div className="flex-shrink-0">
            <ImageWithFallback 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-lg border border-gray-100" 
            />
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
            <ImageIcon className="text-gray-300 size-8" />
          </div>
        )}

        {/* 📝 KONTEN: Layout sama dengan Menu Builder */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate text-base">{item.name}</h3>
              {item.nameEn && <p className="text-xs text-gray-500 truncate">{item.nameEn}</p>}
              <p className="text-orange-600 font-semibold mt-1 text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
            
            {/* Badge Urutan (Pojok Kanan) */}
            <div className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
               {item.order + 1}
            </div>
          </div>
          
          {/* Deskripsi & Kategori */}
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
          <div className="mt-2">
            <span className="inline-block px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded font-medium border border-orange-100">
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ============================================
// 2. DRAG OVERLAY (Tampilan Melayang saat di-drag)
// ============================================
function DragOverlayItem({ item }: { item: MenuItem }) {
  return (
    <Card className="p-4 border-2 border-orange-500 shadow-xl cursor-grabbing opacity-90 bg-white">
      <div className="flex items-start gap-4">
        <button className="mt-2 text-gray-400">
          <GripVertical className="size-5" />
        </button>

        {item.image ? (
          <div className="flex-shrink-0">
             <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
          </div>
        ) : (
           <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
             <ImageIcon className="text-gray-300 size-8" />
           </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
          <p className="text-orange-600 font-semibold mt-1 text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </Card>
  );
}

// ============================================
// 3. KOMPONEN UTAMA
// ============================================
export function MenuSorter() {
  // Menggunakan data dari Context agar sinkron
  const { menuItems, reorderMenuItems, isLoading } = useMenu(); 
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sortir data berdasarkan order sebelum render
  const sortedItems = [...menuItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Jarak geser minimal 5px
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sortedItems.findIndex((item) => item.id === active.id);
      const newIndex = sortedItems.findIndex((item) => item.id === over.id);
      
      // Update array lokal untuk animasi smooth
      const newOrderArray = arrayMove(sortedItems, oldIndex, newIndex);

      // Update properti 'order' untuk setiap item
      const updatedItems = newOrderArray.map((item, index) => ({
        ...item,
        order: index,
      }));

      // Simpan ke Context (ini akan update localStorage & UI lain)
      reorderMenuItems(updatedItems);
      toast.success("Urutan menu berhasil diperbarui");
    }
  };

  const activeItem = activeId ? sortedItems.find((item) => item.id === activeId) : null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Atur Urutan Menu</CardTitle>
          <CardDescription className="text-sm">
            Geser kartu menu di bawah ini untuk mengubah urutan tampilannya di halaman pelanggan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-lg bg-gray-50">
              Belum ada menu untuk diurutkan. Silakan tambah menu terlebih dahulu.
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3"> {/* Jarak antar kartu (space-y-3) sama dengan Builder */}
                  {sortedItems.map((item) => (
                    <SortableMenuCard key={item.id} item={item} />
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeItem ? <DragOverlayItem item={activeItem} /> : null}
              </DragOverlay>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}