interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryChip({ label, isSelected, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      data-active={isSelected}
      className="px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 font-medium text-base border bg-white text-black hover:bg-gray-100 data-[active=true]:bg-black data-[active=true]:text-white data-[active=true]:border-black"
    >
      {label}
    </button>
  );
}



