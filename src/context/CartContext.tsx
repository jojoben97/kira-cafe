"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, DrinkOptions } from '@/types';

interface CartContextType {
    items: CartItem[];
    addToCart: (item: MenuItem, quantity: number, options?: DrinkOptions) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem('kira-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('kira-cart', JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addToCart = (item: MenuItem, quantity: number, options?: DrinkOptions) => {
        const newItem: CartItem = {
            ...item,
            cartId: crypto.randomUUID(),
            quantity,
            options,
            totalPrice: calculateItemPrice(item.price, quantity, options),
        };
        setItems((prev) => [...prev, newItem]);
        setIsCartOpen(true);
    };

    const removeFromCart = (cartId: string) => {
        setItems((prev) => prev.filter((item) => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(cartId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.cartId === cartId
                    ? {
                        ...item,
                        quantity,
                        totalPrice: calculateItemPrice(item.price, quantity, item.options),
                    }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const calculateItemPrice = (basePrice: number, quantity: number, options?: DrinkOptions) => {
        let price = basePrice;
        if (options?.size === 'Large') price += 1.0;
        if (options?.size === 'Small') price -= 0.5;
        if (options?.milk && options.milk !== 'Dairy') price += 0.5; // Plant based tax!
        return price * quantity;
    };

    const cartTotal = items.reduce((total, item) => total + item.totalPrice, 0);
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
