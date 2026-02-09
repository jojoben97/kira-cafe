"use client";

import Link from "next/link";
import { Check, MapPin, Clock, Coffee, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";

export default function PaymentSuccessPage() {
    const { clearCart, cartCount, setIsCartOpen } = useCart();
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        clearCart();
        setOrderId(`#${Math.floor(1000 + Math.random() * 9000)}`);
    }, []);

    const pickupTime = new Date();
    pickupTime.setMinutes(pickupTime.getMinutes() + 15);

    return (
        <main className="min-h-screen flex flex-col bg-[var(--kira-cream)]">
            {/* Mobile View */}
            <div className="lg:hidden flex flex-col items-center justify-center flex-1 p-4 text-center">
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
                            className="w-full bg-[var(--kira-green)] text-white py-4 rounded-full font-semibold hover:bg-[#004d40] transition-colors text-center"
                        >
                            View Order Details
                        </Link>
                        <Link
                            href="/"
                            className="w-full bg-transparent text-gray-700 py-4 rounded-full font-semibold hover:bg-white transition-colors text-center"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex flex-col flex-1">
                {/* Desktop Header */}
                <header className="flex items-center justify-between h-20 px-20 w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--kira-border)]">
                    <Link href="/" className="flex items-center gap-2.5">
                        <Coffee className="w-8 h-8 text-[var(--kira-green)]" />
                        <span className="text-[28px] font-bold text-[var(--kira-text)]">KIRA</span>
                        <span className="text-[28px] font-light text-[var(--kira-text)]">Cafe</span>
                    </Link>
                    <nav className="flex items-center gap-10">
                        <Link href="/order" className="text-[15px] font-medium text-[var(--kira-text-secondary)] hover:text-[var(--kira-green)] transition-colors">Menu</Link>
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

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center py-20 px-20 gap-12">
                    {/* Success Icon */}
                    <div className="w-[120px] h-[120px] bg-[#E8F5E9] rounded-full flex items-center justify-center">
                        <Check className="w-14 h-14 text-[var(--kira-green)]" strokeWidth={2.5} />
                    </div>

                    {/* Success Text */}
                    <div className="flex flex-col items-center gap-3">
                        <h1 className="text-[42px] font-bold text-[var(--kira-text)] text-center">Order Confirmed!</h1>
                        <p className="text-[18px] text-[#888888] text-center">Your order {orderId} has been placed successfully</p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.06)] p-8 w-[700px] flex items-center gap-10">
                        {/* Pickup Location */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[13px] text-[var(--kira-text-secondary)]">Pickup Location</p>
                                <p className="font-semibold text-[var(--kira-text)] text-[16px]">KIRA Cafe - Main Street</p>
                            </div>
                        </div>

                        {/* Ready for Pickup */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                                <Clock className="w-6 h-6 text-[var(--kira-green)]" />
                            </div>
                            <div>
                                <p className="text-[13px] text-[var(--kira-text-secondary)]">Ready for Pickup</p>
                                <p className="font-semibold text-[var(--kira-text)] text-[16px]">
                                    Today at {pickupTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="flex flex-col items-center gap-4 w-[500px]">
                        <div className="w-full h-2 bg-[#E5E5E5] rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-[var(--kira-green)] rounded-full animate-pulse" />
                        </div>
                        <p className="text-[16px] font-medium text-[var(--kira-green)]">Preparing your order...</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="bg-[var(--kira-green)] text-white py-4 px-10 rounded-full font-semibold text-[16px] hover:bg-[#1f4a2f] transition-colors"
                        >
                            View Order Details
                        </Link>
                        <Link
                            href="/"
                            className="bg-white text-[var(--kira-text)] py-4 px-10 rounded-full font-semibold text-[16px] border border-[#E5E5E5] hover:border-[var(--kira-green)] hover:text-[var(--kira-green)] transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </main>
    );
}
