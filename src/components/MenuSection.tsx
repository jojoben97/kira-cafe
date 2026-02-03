"use client";

import { Coffee } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "@/types";

// Displaying a subset of items for the preview
const previewItems: MenuItem[] = [
  {
    id: "1",
    name: "Espresso",
    description: "Rich, bold double shot",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1501527904397-0801af7b5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080",
    category: "coffee",
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Espresso with foamy milk",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1746281673841-31a64ca33ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080",
    category: "coffee",
  },
  {
    id: "3",
    name: "Flat White",
    description: "Velvety smooth espresso",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1742654230335-7575b03fff91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080",
    category: "coffee",
  },
];

function MenuItemPreviewCard(item: MenuItem) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex-1">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <h4 className="text-[16px] font-semibold text-[var(--kira-text)]">{item.name}</h4>
        <p className="text-[13px] text-[var(--kira-text-muted)]">{item.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[15px] font-bold text-[var(--kira-green)]">${item.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function MenuSection() {
  return (
    <section id="menu" className="flex flex-col gap-12 bg-[var(--kira-cream)] py-20 px-4 md:px-20 w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center gap-3 w-full text-center">
        <span className="text-[12px] font-semibold text-[var(--kira-green)] tracking-[2px] uppercase">
          Our Menu
        </span>
        <h2 className="text-[40px] font-semibold text-[var(--kira-text)]">
          Explore our drinks
        </h2>
        <p className="text-[18px] text-[var(--kira-text-secondary)]">
          Handcrafted beverages made with premium ingredients
        </p>
      </div>

      {/* Menu Grid Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto opacity-70 hover:opacity-100 transition-opacity">
        {previewItems.map((item) => (
          <MenuItemPreviewCard key={item.id} {...item} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/order"
          className="flex items-center gap-2 bg-[var(--kira-green)] text-white text-[16px] font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-[#004d40] transition-colors"
        >
          <Coffee className="w-5 h-5" />
          View Full Menu & Order
        </Link>
      </div>
    </section>
  );
}
