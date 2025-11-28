/**
 * 🎯 Komponen Drag & Drop "Pengurutan Menu"
 * * Fitur:
 * - Drag & Drop untuk mengubah urutan menu
 * - Tampilan real-time JSON urutan terbaru
 * - Fungsi simpanUrutan() untuk mock API
 * - UI modern dengan card design
 * - Animasi halus dan cursor grab
 * * Teknologi: React + @dnd-kit/sortable
 */

'use client';

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { GripVertical, Save, Loader2, Copy, Check, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useMenu, MenuItem } from '../contexts/MenuContext'; 
import { ImageWithFallback } from './figma/ImageWithFallback'; 

// ============================================
// 1. KARTU MENU (Disamakan dengan Menu Builder tapi gambar kecil)
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
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative bg-white rounded-lg border shadow-sm flex items-center gap-4 p-4
        transition-all duration-200 ease-in-out
        ${isItemDragging ? 'border-orange-500 shadow-xl scale-105 ring-1 ring-orange-200' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md touch-none flex-shrink-0"
      >
        <GripVertical className="size-5" />
      </button>

      {/* 🖼️ GAMBAR: Diperkecil jadi w-16 h-16 (64px) - Lebih kecil dari Builder (80px) */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
        {item.image ? (
          <ImageWithFallback 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <ImageIcon className="text-gray-300 size-6" />
        )}
      </div>

      {/* 📝 TEKS: Sama persis dengan Menu Builder */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col justify-center">
          {/* Nama Menu: Ukuran default (text-base) */}
          <h3 className="font-semibold text-gray-900 truncate">
            {item.name}
          </h3>
          
          {/* Harga: Ukuran default (text-base) */}
          <p className="text-orange-600 font-semibold mt-1">
            Rp {item.price.toLocaleString('id-ID')}
          </p>
          
          {/* Kategori */}
          <div className="mt-1">
            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {item.category}
            </span>
          </div>
        </div>
      </div>

      {/* Badge Urutan */}
      <div className="flex-shrink-0 w-8 h-8 bg-orange-50 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold border border-orange-100">
        {item.order + 1}
      </div>
    </div>
  );
}

// ============================================
// 2. DRAG OVERLAY (Tampilan saat ditarik)
// ============================================
function DragOverlayItem({ item }: { item: MenuItem }) {
  return (
    <div className="bg-white rounded-lg border-2 border-orange-500 shadow-xl p-4 flex items-center gap-4 opacity-95 cursor-grabbing">
      <GripVertical className="size-5 text-gray-400" />
      
      {/* Gambar Kecil */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
         {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : null}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.name}</h3>
        <p className="text-orange-600 font-semibold mt-1">
            Rp {item.price.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="w-8 h-8 bg-orange-50 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold border border-orange-100">
        {item.order + 1}
      </div>
    </div>
  );
}

// ============================================
// 3. KOMPONEN UTAMA
// ============================================
export function MenuSorter() {
  const { menuItems, reorderMenuItems } = useMenu(); 
  const [activeId, setActiveId] = useState<string | null>(null);

  const sortedItems = [...menuItems].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
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
      
      const newOrderArray = arrayMove(sortedItems, oldIndex, newIndex);

      const updatedItems = newOrderArray.map((item, index) => ({
        ...item,
        order: index,
      }));

      reorderMenuItems(updatedItems);
      toast.success("Urutan disimpan");
    }
  };

  const activeItem = activeId ? sortedItems.find((item) => item.id === activeId) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Atur Urutan</CardTitle>
          <CardDescription className="text-sm">
            Geser untuk mengubah posisi menu.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <div className="space-y-3">
                {sortedItems.map((item) => (
                  <SortableMenuCard key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeItem ? <DragOverlayItem item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}
