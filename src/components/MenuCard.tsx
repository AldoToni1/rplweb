import React from "react";
import { MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MenuCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
  onOrderClick: () => void;
  whatsappLabel: string;
}

export function MenuCard({
  image,
  name,
  description,
  price,
  onOrderClick,
  whatsappLabel,
}: MenuCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 flex flex-col h-full">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 flex-shrink-0 w-full">
        <ImageWithFallback
          src={image || ""}
          alt={name || "Menu item"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="text-gray-900 font-semibold text-base flex-1 leading-tight min-w-0">{name || "Menu Item"}</h3>
          <span className="text-amber-600 whitespace-nowrap font-semibold text-base flex-shrink-0">{price || "Rp 0"}</span>
        </div>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-1">{description || "No description"}</p>
        <button
          onClick={onOrderClick}
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm mt-auto"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span>{whatsappLabel}</span>
        </button>
      </div>
    </div>
  );
}

