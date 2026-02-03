"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
    const { items, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    // Handle animation state
    useEffect(() => {
        if (isCartOpen) setIsVisible(true);
        else setTimeout(() => setIsVisible(false), 300);
    }, [isCartOpen]);

    if (!isVisible && !isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${isCartOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-6 flex items-center justify-between border-b border-[var(--kira-border)]">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-[var(--kira-text)]" />
                        <h2 className="text-xl font-bold text-[var(--kira-text)]">Your Order</h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-[var(--kira-cream)] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--kira-text-secondary)]" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-[var(--kira-text-muted)] gap-4">
                            <ShoppingBag className="w-16 h-16 opacity-20" />
                            <p>Your cart is empty</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-[var(--kira-green)] font-semibold hover:underline"
                            >
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.cartId} className="flex gap-4">
                                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-semibold text-[var(--kira-text)]">{item.name}</h4>
                                            <span className="font-bold text-[var(--kira-green)]">${item.totalPrice.toFixed(2)}</span>
                                        </div>
                                        {item.options && (
                                            <p className="text-xs text-[var(--kira-text-muted)] mt-1">
                                                {item.options.size} • {item.options.milk} • {item.options.sugar} Sugar
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3 bg-[var(--kira-cream)] rounded-lg px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[var(--kira-text-secondary)] hover:text-[var(--kira-text)]"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                className="w-6 h-6 flex items-center justify-center text-[var(--kira-text-secondary)] hover:text-[var(--kira-text)]"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-[var(--kira-border)] bg-[var(--kira-cream)]/30">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[var(--kira-text-secondary)]">Subtotal</span>
                            <span className="text-xl font-bold text-[var(--kira-text)]">${cartTotal.toFixed(2)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="flex w-full bg-[var(--kira-green)] text-white py-4 rounded-xl font-bold justify-center hover:bg-[#004d40] transition-colors"
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
