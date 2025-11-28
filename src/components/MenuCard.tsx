import React from "react";
import { ShoppingCart, ImageIcon, Plus, Minus } from "lucide-react";
import { useCart } from "../contexts/cartcontext";
import type { MenuItem } from "../contexts/MenuContext";

interface MenuCardProps {
  item: MenuItem;
  language?: 'id' | 'en';
}

export function MenuCard({ item, language = 'id' }: MenuCardProps) {
  const { addToCart, getQuantity, decrementQuantity, incrementQuantity } = useCart();

  // Get localized name and description
  const displayName = language === 'id' ? item.name : (item.nameEn || item.name);
  const displayDescription = language === 'id' ? item.description : (item.descriptionEn || item.description);

  // Get current quantity from cart
  const currentQuantity = getQuantity(item.id);

  // Format price as Rupiah
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: displayName,
      price: item.price,
    });
  };

  const handleDecrement = () => {
    decrementQuantity(item.id);
  };

  const handleIncrement = () => {
    if (currentQuantity === 0) {
      addToCart({
        id: item.id,
        name: displayName,
        price: item.price,
      });
    } else {
      incrementQuantity(item.id);
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200 flex flex-col h-full overflow-hidden max-w-[350px] w-full mx-auto">
      {/* Image Section - Fixed Height at Top */}
      <div className="aspect-video overflow-hidden bg-gray-100 flex-shrink-0 w-full relative rounded-t-xl">
        {item.image ? (
          <img
            src={item.image}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Content Section - Flex column with justify-between for bottom-fixed button */}
      <div className="px-4 py-3 flex flex-col flex-grow justify-between min-h-[180px]">
        {/* Top Section: Name, Description, Price - Fixed height area */}
        <div className="flex-grow flex flex-col">
          {/* Product Name - Bold and Clear with fixed height */}
          <h3 className="text-gray-900 font-bold text-lg mb-2 leading-tight line-clamp-2" style={{ minHeight: '3rem' }}>
            {displayName || "Menu Item"}
          </h3>

          {/* Description - Fixed height with line-clamp-2 for uniformity */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3" style={{ minHeight: '2.5rem' }}>
            {displayDescription || "No description"}
          </p>

          {/* Price - Prominent with fixed position */}
          <div className="mb-3">
            <span className="text-orange-600 font-bold text-xl">
              {formatPrice(item.price)}
            </span>
          </div>
        </div>

        {/* Bottom Section: Button - Always at bottom using mt-auto */}
        <div className="mt-auto pt-2">
          {currentQuantity > 0 ? (
            /* Quantity Control - Item already in cart */
            <div className="flex items-center justify-center gap-3 bg-orange-50 rounded-lg py-2.5 px-4 border border-orange-200">
              <button
                onClick={handleDecrement}
                disabled={item.price <= 0}
                className="w-9 h-9 flex items-center justify-center bg-white rounded-lg border border-orange-300 hover:bg-orange-100 active:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4 text-orange-600" />
              </button>
              
              <span className="text-orange-600 font-bold text-lg min-w-[2rem] text-center">
                {currentQuantity}
              </span>
              
              <button
                onClick={handleIncrement}
                disabled={item.price <= 0}
                className="w-9 h-9 flex items-center justify-center bg-white rounded-lg border border-orange-300 hover:bg-orange-100 active:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4 text-orange-600" />
              </button>
            </div>
          ) : (
            /* Add to Cart Button - Item not in cart, always at bottom */
            <button
              onClick={handleAddToCart}
              disabled={item.price <= 0}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
              type="button"
            >
              <ShoppingCart size={20} className="flex-shrink-0" />
              <span>Tambah ke Keranjang</span>
            </button>
          )}
        </div>
=======
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-900">{name}</h3>
          <span className="text-amber-600 whitespace-nowrap ml-2">{price}</span>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          onClick={onOrderClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          {whatsappLabel}
        </button>
>>>>>>> 4175ef567446cd27af733bdd6ff23c256d2e25d3
      </div>
    </div>
  );
}
