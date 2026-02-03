"use client";

import Link from "next/link";
import { Check, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

export default function PaymentSuccessPage() {
    const { clearCart } = useCart();
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        // Clear the cart on successful payment load
        clearCart();
        // Generate a random order number for display
        setOrderId(`#${Math.floor(1000 + Math.random() * 9000)}`);
    }, []);

    const pickupTime = new Date();
    pickupTime.setMinutes(pickupTime.getMinutes() + 15);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[#F5F3EF] p-4 text-center">
            <div className="max-w-sm w-full flex flex-col items-center gap-6">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-[var(--kira-green)]" strokeWidth={3} />
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Confirmed!</h1>
                    <p className="text-gray-500 text-sm">Your order {orderId} has been placed</p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl p-4 w-full shadow-sm">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">Pickup Location</p>
                            <p className="font-semibold text-gray-900 text-sm">KIRA Cafe - Main Street</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                        <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                            <Clock className="w-5 h-5 text-[var(--kira-green)]" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-500">Ready for Pickup</p>
                            <p className="font-semibold text-gray-900 text-sm">
                                Today at {pickupTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status */}
                <p className="text-gray-400 text-sm">Preparing your order...</p>

                {/* Buttons */}
                <div className="flex flex-col gap-3 w-full">
                    <Link
                        href="/"
                        className="w-full bg-[var(--kira-green)] text-white py-4 rounded-full font-semibold hover:bg-[#004d40] transition-colors"
                    >
                        View Order Details
                    </Link>
                    <Link
                        href="/"
                        className="w-full bg-transparent text-gray-700 py-4 rounded-full font-semibold hover:bg-white transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
