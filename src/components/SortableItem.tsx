'use client';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ImageIcon } from 'lucide-react';
import type { MenuItem } from '../contexts/MenuContext';

interface SortableItemProps {
  id: string;
  item: MenuItem;
  orderNumber: number;
}

export default function SortableItem({ id, item, orderNumber }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
  };

  // Format price as Rupiah
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm ${
        isDragging ? 'ring-2 ring-blue-200 border-blue-500' : 'border-gray-200 hover:border-gray-300'
      } transition-all`}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </button>

      {/* Image - 64x64px (w-16 h-16) */}
      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-gray-200">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate mb-1">{item.name}</div>
        <div className="text-sm text-gray-500 truncate line-clamp-1">
          {item.description || 'Tidak ada deskripsi'}
        </div>
      </div>

      {/* Price */}
      <div className="font-semibold text-orange-600 flex-shrink-0 mr-3">
        {formatPrice(item.price)}
      </div>

      {/* Order Number Badge */}
      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
        {orderNumber}
      </div>
    </div>
  );
}
