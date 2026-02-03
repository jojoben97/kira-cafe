"use client";

import { Plus } from "lucide-react";
import Image from "next/image";

interface DrinkCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  onAdd?: () => void;
}

export default function DrinkCard({ name, description, price, image, onAdd }: DrinkCardProps) {
  return (
    <div className="flex flex-col gap-4 bg-[var(--kira-cream)] p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex-1">
      {/* Image */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <h3 className="text-[18px] font-semibold text-[var(--kira-text)]">{name}</h3>
        <p className="text-[14px] text-[var(--kira-text-muted)]">{description}</p>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between">
        <span className="text-[20px] font-bold text-[var(--kira-green)]">{price}</span>
        <button
          onClick={onAdd}
          className="flex items-center justify-center w-10 h-10 bg-[var(--kira-green)] rounded-full hover:opacity-90 transition-opacity"
        >
          <Plus className="w-[18px] h-[18px] text-white" />
        </button>
      </div>
    </div>
  );
}
