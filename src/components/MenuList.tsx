// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   DragEndEvent,
// } from "@dnd-kit/core";

// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// import SortableItem from "./SortableItem";
// // 👇 IMPORT MenuItem DARI CONTEXT, JANGAN BIKIN SENDIRI
// import { useMenu, MenuItem } from "../contexts/MenuContext"; 

// export default function MenuList() {
//   const { menuItems, reorderMenuItems } = useMenu();

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor)
//   );

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over) return;
//     if (active.id === over.id) return;

//     // Pastikan casting tipe data benar saat findIndex
//     const oldIndex = menuItems.findIndex((i) => i.id === active.id);
//     const newIndex = menuItems.findIndex((i) => i.id === over.id);

//     const newOrder = arrayMove(menuItems, oldIndex, newIndex);

//     reorderMenuItems(newOrder);
//   };

//   return (
//     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={menuItems} strategy={verticalListSortingStrategy}>
//         <div className="flex flex-col gap-2">
//           {menuItems.map((item) => (
//             // 👇 Error merah harusnya hilang karena 'item' sekarang tipenya sudah lengkap
//             <SortableItem key={item.id} id={item.id} item={item} />
//           ))}
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// }

///////////////////////////////////////////////////
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
// import SortableItem from "./SortableItem";
// import { useMenu } from "../contexts/MenuContext.tsx";

// export default function MenuList() {
//   const { menuItems, reorderMenuItems } = useMenu();

//   // kita ambil semua id menu
//   const ids = menuItems.map((item) => item.id);

//   const handleDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (!over) return;

//     if (active.id !== over.id) {
//       const oldIndex = ids.indexOf(active.id);
//       const newIndex = ids.indexOf(over.id);

//       const newOrder = arrayMove(menuItems, oldIndex, newIndex);

//       // update ke Supabase + localStorage
//       reorderMenuItems(newOrder);
//     }
//   };

//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={ids} strategy={verticalListSortingStrategy}>
//         <div className="space-y-3">
//           {menuItems.map((item) => (
//             <SortableItem key={item.id} id={item.id} item={item} />
//           ))}
//         </div>
//       </SortableContext>
//     </DndContext>
//   );
// }
'use client';
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import { useMenu } from '../contexts/MenuContext';

export default function MenuList() {
  const { menuItems, reorderMenuItems, isLoading } = useMenu();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (isLoading) return <div>Loading...</div>;
  const ids = menuItems.map(m => m.id);

  const handleDragEnd = (e:any) => {
    const { active, over } = e;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      const newOrder = arrayMove(menuItems, oldIndex, newIndex);
      reorderMenuItems(newOrder);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {menuItems.map(item => <SortableItem key={item.id} id={item.id} item={item} />)}
        </div>
      </SortableContext>
    </DndContext>
  );
}
