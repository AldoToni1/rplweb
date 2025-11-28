import React, { useState, useEffect } from 'react';
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
} from '@dnd-kit/sortable';
import { useMenu } from '../contexts/MenuContext';
import SortableItem from './SortableItem';
import { Button } from './ui/button';
import { Save, Copy, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function MenuSorting() {
  const { menuItems, reorderMenuItems, isLoading } = useMenu();
  const [items, setItems] = useState(menuItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Update local state when menuItems change (sinkronisasi dengan Menu Builder)
  useEffect(() => {
    const sortedItems = [...menuItems].sort((a, b) => (a.order || 0) - (b.order || 0));
    setItems(sortedItems);
  }, [menuItems]);

  // Sensors untuk drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Harus drag minimal 8px baru aktif
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler: Drag Start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handler: Drag End - Update urutan
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Reorder items
        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update order property untuk setiap item
        const reorderedItems = newItems.map((item, index) => ({
          ...item,
          order: index,
        }));

        return reorderedItems;
      });
    }

    setActiveId(null);
  };

  // Handler: Simpan Urutan ke Supabase
  const handleSaveOrder = async () => {
    try {
      setIsSaving(true);

      // Update order property untuk setiap item berdasarkan posisi saat ini
      const reorderedItems = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      // Update di Supabase melalui MenuContext (akan sinkronisasi ke semua tampilan)
      await reorderMenuItems(reorderedItems);

      toast.success('Urutan menu berhasil disimpan!');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Gagal menyimpan urutan menu');
    } finally {
      setIsSaving(false);
    }
  };

  // Handler: Salin JSON
  const handleCopyJSON = () => {
    const jsonData = JSON.stringify(
      items.map((item, index) => ({
        id: item.id,
        name: item.name,
        order: index + 1,
      })),
      null,
      2
    );

    navigator.clipboard.writeText(jsonData);
    setCopied(true);
    toast.success('JSON berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengurutan Menu</h1>
        <p className="text-gray-600">
          Geser (drag) kartu menu untuk mengubah urutan. Urutan akan terupdate secara real-time.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleSaveOrder}
          disabled={isSaving}
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Simpan Urutan
            </>
          )}
        </Button>
        <Button
          onClick={handleCopyJSON}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Salin JSON
            </>
          )}
        </Button>
      </div>

      {/* Drag & Drop List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id} item={item} orderNumber={index + 1} />
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay - Preview saat dragging */}
        <DragOverlay>
          {activeItem ? (
            <div className="opacity-90 transform rotate-2 bg-white rounded-lg border-2 border-blue-500 shadow-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {activeItem.image ? (
                    <img src={activeItem.image} className="w-full h-full object-cover" alt={activeItem.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{activeItem.name}</div>
                  <div className="text-sm text-gray-500 truncate">{activeItem.description || 'Tidak ada deskripsi'}</div>
                </div>
                <div className="font-semibold text-orange-600">Rp {activeItem.price.toLocaleString('id-ID')}</div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

