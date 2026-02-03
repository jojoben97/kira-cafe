"use client";

import { useState } from "react";
import { Coffee, Plus, ShoppingBag, Home, FileText, User, Search } from "lucide-react";
import Image from "next/image";
import { MenuItem } from "@/types";
import DrinkModal from "@/components/DrinkModal";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const categories = [
    { id: "coffee", name: "Coffee", icon: true },
    { id: "tea", name: "Tea", icon: false },
    { id: "smoothies", name: "Smoothies", icon: false },
    { id: "others", name: "Others", icon: false }, // Added Others
    { id: "pastries", name: "Pastries", icon: false },
];


const menuItems: MenuItem[] = [
    // Coffee Items (Existing)
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
    // Tea Items
    {
        id: "7",
        name: "Matcha Latte",
        description: "Ceremonial green tea with milk",
        price: 5.00,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM1Mjl8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "tea",
    },
    {
        id: "8",
        name: "Earl Grey",
        description: "Black tea with bergamot oil",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1627820751275-fcc1b56956dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM1Mjh8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "tea",
    },
    {
        id: "9",
        name: "Chai Latte",
        description: "Spiced tea with steamed milk",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM1Mjh8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "tea",
    },
    // Smoothies
    {
        id: "10",
        name: "Berry Blast",
        description: "Mixed berries, yogurt, honey",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1628557044797-f21a17b96c89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM2MTB8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "smoothies",
    },
    {
        id: "11",
        name: "Green Glow",
        description: "Spinach, banana, apple juice",
        price: 6.50,
        image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM2MTB8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "smoothies",
    },
    {
        id: "12",
        name: "Mango Madness",
        description: "Mango, pineapple, coconut milk",
        price: 6.00,
        image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM2MTB8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "smoothies",
    },
    // Others
    {
        id: "13",
        name: "Sky Juice",
        description: "Premium filtered ice water",
        price: 1.00,
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTQwMjN8&ixlib=rb-4.1.0&q=80&w=1080",
        category: "others",
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

// Get greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

// Popular drinks for homepage
const popularDrinks = [
    {
        id: "1",
        name: "Caramel Latte",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
        id: "7",
        name: "Matcha Oat",
        price: 5.00,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
];

export default function MobileOrderView() {
    const [activeCategory, setActiveCategory] = useState("coffee");
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"home" | "menu">("home");
    const { cartCount, setIsCartOpen } = useCart();

    const handleSelect = (item: MenuItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handlePopularSelect = (drink: typeof popularDrinks[0]) => {
        const menuItem = menuItems.find(item => item.id === drink.id);
        if (menuItem) {
            setSelectedItem(menuItem);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF8] pb-24">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#FAFAF8] px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--kira-green)] rounded-lg flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">KIRA</span>
                </div>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2"
                >
                    <ShoppingBag className="w-6 h-6 text-gray-700" />
                    {cartCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center bg-[var(--kira-green)] text-white text-[9px] font-bold rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>
            </header>

            {activeTab === "home" ? (
                <div className="flex flex-col gap-6 px-4 md:max-w-xl md:mx-auto">
                    {/* Greeting */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {getGreeting()},<br />Coffee lover ☕
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Start your day with a perfect cup</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search drinks..."
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--kira-green)]/20"
                            onClick={() => setActiveTab("menu")}
                            readOnly
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        setActiveCategory(category.id);
                                        setActiveTab("menu");
                                    }}
                                    className="flex-shrink-0 flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:border-[var(--kira-green)] hover:text-[var(--kira-green)] transition-colors"
                                >
                                    {category.icon && <Coffee className="w-4 h-4" />}
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular Drinks */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-gray-900">Popular Drinks</h3>
                            <button
                                onClick={() => setActiveTab("menu")}
                                className="text-sm text-[var(--kira-green)] font-medium"
                            >
                                See all
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {popularDrinks.map((drink) => (
                                <div
                                    key={drink.id}
                                    onClick={() => handlePopularSelect(drink)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="relative h-32 bg-gray-100">
                                        <Image
                                            src={drink.image}
                                            alt={drink.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-semibold text-gray-900 text-sm">{drink.name}</h4>
                                        <p className="text-[var(--kira-green)] font-semibold text-sm mt-1">${drink.price.toFixed(2)}</p>
                                        <button className="w-full mt-2 bg-[var(--kira-green)] text-white py-2 rounded-full text-sm font-medium flex items-center justify-center gap-1">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4 px-4 md:max-w-xl md:mx-auto">
                    {/* Menu Title */}
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Menu</h1>
                        <p className="text-gray-500 text-sm">Choose your favorite drink</p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex-shrink-0 flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all ${activeCategory === category.id
                                    ? "bg-[var(--kira-green)] text-white"
                                    : "bg-white text-gray-700 border border-gray-200"
                                    }`}
                            >
                                {category.icon && <Coffee className="w-4 h-4" />}
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Menu List */}
                    <div className="flex flex-col gap-3">
                        {menuItems
                            .filter(item => item.category === activeCategory)
                            .map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="flex items-center gap-3 bg-white p-3 rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
                                >
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                                        <p className="text-[var(--kira-green)] font-semibold text-sm mt-1">${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        {menuItems.filter(item => item.category === activeCategory).length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                <Coffee className="w-12 h-12 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">No items found for {activeCategory}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedItem && (
                <DrinkModal
                    item={selectedItem}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <CartDrawer />

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-8 flex justify-around items-center z-50 safe-area-bottom">
                <button
                    onClick={() => setActiveTab("home")}
                    className={`flex flex-col items-center gap-1 ${activeTab === "home" ? "text-[var(--kira-green)]" : "text-gray-400"}`}
                >
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button
                    onClick={() => setActiveTab("menu")}
                    className={`flex flex-col items-center gap-1 ${activeTab === "menu" ? "text-[var(--kira-green)]" : "text-gray-400"}`}
                >
                    <Coffee className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400">
                    <FileText className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Orders</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-gray-400">
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Profile</span>
                </button>
            </nav>
        </div>
    );
}
