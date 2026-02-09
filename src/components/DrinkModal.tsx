"use client";

import { useState } from "react";
import { ArrowLeft, Minus, Plus, Coffee, ShoppingBag } from "lucide-react";
import { MenuItem, DrinkOptions, DrinkSize, MilkType, SugarLevel } from "@/types";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

interface DrinkModalProps {
    item: MenuItem;
    isOpen: boolean;
    onClose: () => void;
}

// Items that don't need milk customization
const noMilkCategories = ["others", "water", "pastries", "smoothies"];
const noMilkItems = ["Sky Juice", "Water"];

// Items that don't need size customization
const noSizeCategories = ["pastries", "water"];

// Cup icon component for size selection
function CupIcon({ size, isSelected }: { size: "small" | "medium" | "large"; isSelected: boolean }) {
    const heights = { small: "h-4", medium: "h-5", large: "h-6" };
    return (
        <div className={`${heights[size]} w-4 border-2 rounded-sm ${isSelected ? "border-[var(--kira-green)]" : "border-gray-400"}`}>
            <div className={`w-1 h-1.5 border-t-2 border-r-2 rounded-tr absolute -right-1 top-0 ${isSelected ? "border-[var(--kira-green)]" : "border-gray-400"}`} />
        </div>
    );
}

export default function DrinkModal({ item, isOpen, onClose }: DrinkModalProps) {
    const { addToCart } = useCart();
    const [size, setSize] = useState<DrinkSize>("Medium");
    const [milk, setMilk] = useState<MilkType>("Dairy");
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    // Check if this item should show milk options
    const showMilkOptions = !noMilkCategories.includes(item.category) && !noMilkItems.includes(item.name);

    // Check if this item should show size options
    const showSizeOptions = !noSizeCategories.includes(item.category);

    const handleAddToCart = () => {
        const options: DrinkOptions = {
            size,
            milk: showMilkOptions ? milk : "Dairy", // Default for non-milk items
            sugar: "50%"
        };
        addToCart(item, quantity, options);
        onClose();
        setQuantity(1);
    };

    const calculateUnitPrice = () => {
        let price = item.price;
        if (showSizeOptions) {
            if (size === 'Large') price += 1.0;
            if (size === 'Small') price -= 0.5;
        }
        if (showMilkOptions && milk && milk !== 'Dairy') price += 0.5;
        return price;
    };

    const totalPrice = calculateUnitPrice() * quantity;

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white px-4 py-4 flex items-center">
                <button
                    onClick={onClose}
                    className="absolute left-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 w-full text-center">Customize</h1>
            </header>

            {/* Product Image */}
            <div className="relative h-56 w-full bg-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>

            <div className="p-4 pb-28 flex flex-col gap-6">
                {/* Title and Price */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                    </div>
                    <span className="text-lg font-bold text-[var(--kira-green)] bg-[#E8F5E9] px-3 py-1 rounded-full">
                        ${item.price.toFixed(2)}
                    </span>
                </div>

                {/* Size Selection - Only show for items with size options */}
                {showSizeOptions && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
                        <div className="flex gap-3">
                            {(["Small", "Medium", "Large"] as DrinkSize[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${size === s
                                        ? "border-[var(--kira-green)] bg-[#E8F5E9]"
                                        : "border-gray-200 bg-white"
                                        }`}
                                >
                                    <Coffee className={`w-5 h-5 ${size === s ? "text-[var(--kira-green)]" : "text-gray-400"}`} />
                                    <span className={`text-sm font-medium ${size === s ? "text-[var(--kira-green)]" : "text-gray-600"}`}>
                                        {s}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Milk Selection - Only show for drinks that have milk */}
                {showMilkOptions && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Milk</h3>
                        <div className="flex flex-wrap gap-2">
                            {(["Dairy", "Oat", "Almond", "Soy"] as MilkType[]).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setMilk(m)}
                                    className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${milk === m
                                        ? "bg-[var(--kira-green)] text-white"
                                        : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {m === "Dairy" ? "Whole" : m}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                            <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 rounded-full bg-[var(--kira-green)] flex items-center justify-center hover:bg-[#004d40] transition-colors"
                        >
                            <Plus className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-[var(--kira-green)] text-white py-4 rounded-full font-semibold text-base hover:bg-[#004d40] transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
