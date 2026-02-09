"use client";

import { useState } from "react";
import { Coffee, Leaf, IceCream, Croissant, Droplets, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem } from "@/types";
import DrinkModal from "@/components/DrinkModal";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

const categories = [
    { id: "coffee", name: "Coffee", icon: Coffee },
    { id: "tea", name: "Tea", icon: Leaf },
    { id: "smoothies", name: "Smoothies", icon: IceCream },
    { id: "pastries", name: "Pastries", icon: Croissant },
    { id: "water", name: "Water", icon: Droplets },
];

const menuItems: MenuItem[] = [
    // Coffee
    {
        id: "1",
        name: "Espresso",
        description: "Rich, bold double shot",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1501527904397-0801af7b5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "2",
        name: "Cappuccino",
        description: "Espresso with foamy milk",
        price: 4.00,
        image: "https://images.unsplash.com/photo-1746281673841-31a64ca33ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "3",
        name: "Flat White",
        description: "Velvety smooth espresso",
        price: 4.25,
        image: "https://images.unsplash.com/photo-1742654230335-7575b03fff91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "4",
        name: "Mocha",
        description: "Chocolate espresso blend",
        price: 5.25,
        image: "https://images.unsplash.com/photo-1749104028327-a33087ea4f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "5",
        name: "Cold Brew",
        description: "Slow-steeped, smooth, bold",
        price: 4.75,
        image: "https://images.unsplash.com/photo-1596078841463-5504c992222f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "6",
        name: "Caramel Latte",
        description: "Espresso, steamed milk, caramel",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1623839014265-91b83ec96b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "7",
        name: "Matcha Oat Latte",
        description: "Matcha, oat milk, vanilla",
        price: 5.00,
        image: "https://images.unsplash.com/photo-1584031037009-c3cde80bd41f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    {
        id: "8",
        name: "Iced Americano",
        description: "Espresso, cold water, ice",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "coffee",
    },
    // Tea
    {
        id: "9",
        name: "Earl Grey",
        description: "Classic bergamot black tea",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "tea",
    },
    {
        id: "10",
        name: "Green Tea",
        description: "Light, refreshing Japanese sencha",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1556881286-fc6915169721?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "tea",
    },
    {
        id: "11",
        name: "Chai Latte",
        description: "Spiced tea with steamed milk",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1578899952107-9c390f1af1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "tea",
    },
    {
        id: "12",
        name: "Iced Peach Tea",
        description: "Cold brew tea with peach",
        price: 4.00,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "tea",
    },
    {
        id: "13",
        name: "Jasmine Tea",
        description: "Fragrant floral green tea",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "tea",
    },
    {
        id: "14",
        name: "Matcha Latte",
        description: "Premium matcha with milk",
        price: 5.00,
        image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "tea",
    },
    // Smoothies
    {
        id: "15",
        name: "Berry Blast",
        description: "Mixed berries, banana, yogurt",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "smoothies",
    },
    {
        id: "16",
        name: "Tropical Paradise",
        description: "Mango, pineapple, coconut",
        price: 6.50,
        image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "smoothies",
    },
    {
        id: "17",
        name: "Green Power",
        description: "Spinach, banana, almond milk",
        price: 6.50,
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "smoothies",
    },
    {
        id: "18",
        name: "Peanut Butter Banana",
        description: "Banana, peanut butter, oat milk",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "smoothies",
    },
    // Pastries
    {
        id: "19",
        name: "Butter Croissant",
        description: "Flaky, buttery French pastry",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "pastries",
    },
    {
        id: "20",
        name: "Chocolate Muffin",
        description: "Rich double chocolate muffin",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "pastries",
    },
    {
        id: "21",
        name: "Blueberry Scone",
        description: "Fresh blueberries, lemon glaze",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "pastries",
    },
    {
        id: "22",
        name: "Cinnamon Roll",
        description: "Warm, gooey cinnamon swirl",
        price: 4.00,
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "pastries",
    },
    // Water
    {
        id: "23",
        name: "Sky Juice",
        description: "Pure refreshing water, 500ml",
        price: 1.00,
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "water",
    },
    {
        id: "24",
        name: "Sparkling Water",
        description: "Refreshing carbonated water, 500ml",
        price: 2.50,
        image: "https://images.unsplash.com/photo-1606168094336-48f205276929?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "water",
    },
    {
        id: "25",
        name: "Coconut Water",
        description: "Natural coconut water, 330ml",
        price: 4.00,
        image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "water",
    },
    {
        id: "26",
        name: "Lemon Water",
        description: "Fresh lemon infused water",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
        category: "water",
    },
];

interface MenuItemCardProps extends MenuItem {
    onSelect: (item: MenuItem) => void;
}

// Mobile Menu Card
function MobileMenuCard({ onSelect, ...item }: MenuItemCardProps) {
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

// Desktop Menu Card (matching the design)
function DesktopMenuCard({ onSelect, ...item }: MenuItemCardProps) {
    return (
        <div
            onClick={() => onSelect(item)}
            className="group cursor-pointer flex flex-col gap-4 bg-white p-5 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all hover:shadow-lg hover:-translate-y-1"
        >
            <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
                <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-[20px] font-semibold text-[var(--kira-text)]">{item.name}</h4>
                <p className="text-[14px] text-[#888888]">{item.description}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
                <span className="text-[22px] font-bold text-[var(--kira-green)]">${item.price.toFixed(2)}</span>
                <button className="flex items-center justify-center w-11 h-11 bg-[var(--kira-green)] rounded-full text-white hover:bg-[#1f4a2f] transition-colors">
                    <Plus size={20} strokeWidth={2.5} />
                </button>
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

    // Filter menu items by active category
    const filteredItems = menuItems.filter(item => item.category === activeCategory);

    return (
        <main className="min-h-screen bg-[var(--kira-cream)] flex flex-col">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--kira-border)] px-4 py-4 flex items-center justify-between">
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

            {/* Desktop Header */}
            <header className="hidden lg:flex items-center justify-between h-20 px-20 w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--kira-border)]">
                <Link href="/" className="flex items-center gap-2.5">
                    <Coffee className="w-8 h-8 text-[var(--kira-green)]" />
                    <span className="text-[28px] font-bold text-[var(--kira-text)]">KIRA</span>
                    <span className="text-[28px] font-light text-[var(--kira-text)]">Cafe</span>
                </Link>
                <nav className="flex items-center gap-10">
                    <span className="text-[15px] font-semibold text-[var(--kira-green)]">Menu</span>
                    <Link href="/#about" className="text-[15px] font-medium text-[var(--kira-text-secondary)] hover:text-[var(--kira-green)] transition-colors">About</Link>
                    <Link href="/#locations" className="text-[15px] font-medium text-[var(--kira-text-secondary)] hover:text-[var(--kira-green)] transition-colors">Locations</Link>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="flex items-center gap-2 bg-[var(--kira-green)] text-white py-3 px-6 rounded-full hover:bg-[#1f4a2f] transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="text-[15px] font-semibold">Cart</span>
                        {cartCount > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 bg-white text-[var(--kira-green)] text-[11px] font-bold rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </nav>
            </header>

            {/* Desktop Hero Section */}
            <section className="hidden lg:flex flex-col items-center gap-3 bg-white py-16 px-20 w-full">
                <h1 className="text-[48px] font-bold text-[var(--kira-text)] text-center">Our Menu</h1>
                <p className="text-[18px] text-[var(--kira-text-secondary)] text-center">
                    Choose your favorite drink and customize it just the way you like
                </p>
            </section>

            {/* Category Tabs - Desktop */}
            <section className="hidden lg:flex items-center justify-center gap-4 py-6 px-20 w-full">
                {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`flex items-center gap-2 py-3.5 px-7 rounded-full text-[15px] font-medium transition-all ${
                                activeCategory === category.id
                                    ? "bg-[var(--kira-green)] text-white font-semibold shadow-md"
                                    : "bg-white text-[var(--kira-text-secondary)] border border-[#E5E5E5] hover:border-[var(--kira-green)] hover:text-[var(--kira-green)]"
                            }`}
                        >
                            <IconComponent className="w-[18px] h-[18px]" />
                            {category.name}
                        </button>
                    );
                })}
            </section>

            {/* Desktop Menu Grid */}
            <section className="hidden lg:block flex-1 py-10 px-20 pb-20">
                <div className="grid grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <DesktopMenuCard key={item.id} {...item} onSelect={handleSelect} />
                    ))}
                </div>
            </section>

            {/* Mobile View */}
            <div className="lg:hidden flex flex-col gap-6 py-6 px-4 pb-24 flex-1">
                {/* Category Tabs - Mobile */}
                <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex-shrink-0 flex items-center gap-2 py-2 px-5 rounded-full text-[14px] font-medium transition-all ${
                                    activeCategory === category.id
                                        ? "bg-[var(--kira-green)] text-white font-semibold shadow-md"
                                        : "bg-white text-[var(--kira-text-secondary)] border border-[var(--kira-border)]"
                                }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Menu Grid - Mobile */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[var(--kira-text)] capitalize">{activeCategory}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredItems.map((item) => (
                            <MobileMenuCard key={item.id} {...item} onSelect={handleSelect} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Footer */}
            <div className="hidden lg:block">
                <Footer />
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
