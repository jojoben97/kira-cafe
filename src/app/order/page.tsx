"use client";

import { useState } from "react";
import { Coffee, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "@/types";
import DrinkModal from "@/components/DrinkModal";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

// Reusing the same data structure for now. In a real app, this might come from an API or shared constant.
const categories = [
    { id: "coffee", name: "Coffee", icon: true },
    { id: "tea", name: "Tea", icon: false },
    { id: "smoothies", name: "Smoothies", icon: false },
    { id: "pastries", name: "Pastries", icon: false },
];

const menuItems: MenuItem[] = [
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
    {
        id: "4",
        name: "Mocha",
        description: "Chocolate espresso blend",
        price: 5.00,
        image: "https://images.unsplash.com/photo-1749104028327-a33087ea4f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "coffee",
    },
    {
        id: "5",
        name: "Cold Brew",
        description: "Smooth cold steeped coffee",
        price: 4.00,
        image: "https://images.unsplash.com/photo-1596078841463-5504c992222f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "coffee",
    },
    {
        id: "6",
        name: "Affogato",
        description: "Espresso over gelato",
        price: 5.50,
        image: "https://images.unsplash.com/photo-1528731918315-d95040a988ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjZ8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "coffee",
    },
];

interface MenuItemCardProps extends MenuItem {
    onSelect: (item: MenuItem) => void;
}

function MenuItemCard({ onSelect, ...item }: MenuItemCardProps) {
    return (
        <div
            onClick={() => onSelect(item)}
            className="group cursor-pointer flex items-center gap-4 bg-white p-4 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex-1 transition-all hover:shadow-lg hover:-translate-y-1"
        >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col gap-1 flex-1">
                <h4 className="text-[16px] font-semibold text-[var(--kira-text)]">{item.name}</h4>
                <p className="text-[13px] text-[var(--kira-text-muted)]">{item.description}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[15px] font-bold text-[var(--kira-green)]">${item.price.toFixed(2)}</span>
                    <div className="bg-[var(--kira-cream)] p-1.5 rounded-full text-[var(--kira-green)] opacity-100 transition-opacity">
                        <Plus size={16} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderPage() {
    const [activeCategory, setActiveCategory] = useState("coffee");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { cartCount, setIsCartOpen } = useCart();

    const handleSelect = (item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    return (
        <main className="min-h-screen bg-[var(--kira-cream)]">
            {/* Mobile-style Header */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--kira-border)] px-4 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-[var(--kira-text-secondary)]">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-lg font-bold text-[var(--kira-text)]">Menu</h1>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 rounded-full transition-colors group"
                >
                    <ShoppingBag className="w-6 h-6 text-[var(--kira-text)]" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-[var(--kira-green)] text-white text-[10px] font-bold rounded-full border border-white">
                            {cartCount}
                        </span>
                    )}
                </button>
            </header>

            <div className="flex flex-col gap-6 py-6 px-4 pb-24 md:max-w-xl md:mx-auto">
                {/* Category Tabs */}
                <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex-shrink-0 flex items-center gap-2 py-2 px-5 rounded-full text-[14px] font-medium transition-all ${activeCategory === category.id
                                    ? "bg-[var(--kira-green)] text-white font-semibold shadow-md"
                                    : "bg-white text-[var(--kira-text-secondary)] border border-[var(--kira-border)]"
                                }`}
                        >
                            {category.icon && <Coffee className="w-4 h-4" />}
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[var(--kira-text)] capitalize">{activeCategory}</h3>

                    <div className="grid grid-cols-1 gap-4">
                        {menuItems.map((item) => (
                            <MenuItemCard key={item.id} {...item} onSelect={handleSelect} />
                        ))}
                    </div>
                </div>
            </div>

            {selectedItem && (
                <DrinkModal
                    item={selectedItem}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <CartDrawer />
        </main>
    );
}
