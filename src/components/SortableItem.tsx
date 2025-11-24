// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { MenuItem } from "../contexts/MenuContext";
// import { GripVertical, ImageIcon } from "lucide-react";

// interface Props {
//   id: string;
//   item: MenuItem;
// }

// export default function SortableItem({ id, item }: Props) {
//   // Hook utama dari dnd-kit
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });

//   // Style dinamis untuk transformasi saat di-drag
// //   const style = {
// //     transform: CSS.Transform.toString(transform),
// //     transition,
// //     zIndex: isDragging ? 50 : "auto", // Agar item melayang di atas saat ditarik
// //     opacity: isDragging ? 0.5 : 1, // Memberi efek transparan saat ditarik
// //     position: "relative" as "relative",
// //   };

// const style: React.CSSProperties = {
//   transform: CSS.Transform.toString(transform),
//   transition,
//   opacity: isDragging ? 0.5 : 1,
//   zIndex: isDragging ? 50 : "auto",
//   position: "relative",
// };


//   // Helper untuk format Rupiah
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`
//         flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm
//         ${isDragging ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
//       `}
//     >
//      {/* DRAG HANDLE */}
//       <button
//         {...attributes}
//         {...listeners}
//         className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded touch-none"
//       >
//         <GripVertical size={20} />
//       </button>

//        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center border">
//         {item.image ? (
//           <img src={item.image} className="h-full w-full object-cover" />
//         ) : (
//           <ImageIcon className="h-5 w-5 text-gray-400" />
//         )}
//       </div>

//       <div className="flex-1 min-w-0">
//         <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
//         <p className="text-xs text-gray-500 truncate">
//           {item.description || "Tidak ada deskripsi"}
//         </p>
//       </div>


//           <div className="font-semibold text-sm text-gray-900">
//         Rp {item.price.toLocaleString("id-ID")}
//       </div>
//     </div>
//   );
// }
/////////////////////////
//       <button
//         {...attributes}
//         {...listeners}
//         className="cursor-grab active:cursor-grabbing p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded touch-none"
//         title="Geser untuk mengubah urutan"
//       >
//         <GripVertical size={20} />
//       </button>

//       {/* Gambar Menu (Placeholder jika tidak ada gambar) */}
//       <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center border border-gray-100">
//         {item.image ? (
//           <img 
//             src={item.image} 
//             alt={item.name} 
//             className="h-full w-full object-cover" 
//           />
//         ) : (
//           <ImageIcon className="h-5 w-5 text-gray-400" />
//         )}
//       </div>

//       {/* Informasi Menu */}
//       <div className="flex-1 min-w-0">
//         <h4 className="font-medium text-gray-900 truncate">
//           {item.name}
//         </h4>
//         <p className="text-xs text-gray-500 truncate">
//             {item.description || "Tidak ada deskripsi"}
//         </p>
//       </div>

//       {/* Harga */}
//       <div className="font-semibold text-sm text-gray-900 shrink-0">
//         {formatPrice(item.price)}
//       </div>
//     </div>
//   );
// }

'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ImageIcon } from 'lucide-react';
import type { MenuItem } from '../contexts/MenuContext';

export default function SortableItem({ id, item }: { id: string; item: MenuItem }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 p-3 rounded-lg border bg-white ${isDragging ? 'ring-2 ring-blue-200' : 'border-gray-200'}`}>
      <button {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing">
        <GripVertical />
      </button>
      <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
        {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <ImageIcon />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{item.name}</div>
        <div className="text-sm text-gray-500 truncate">{item.description}</div>
      </div>
      <div className="font-semibold">Rp {item.price.toLocaleString('id-ID')}</div>
    </div>
  );
}
