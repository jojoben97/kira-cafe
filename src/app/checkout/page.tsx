"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Clock, Lock, Check } from "lucide-react";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const [customerName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [waitingForPayment, setWaitingForPayment] = useState(false);

    const handlePayment = async () => {
        if (!customerName.trim()) {
            setError("Please enter your name for the order");
            return;
        }
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items,
                    totalAmount: cartTotal,
                    customerName,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment initiation failed");
            }

            // Redirect to KIRA Pay
            if (data.paymentUrl) {
                // Save Order to Local Storage for Admin Sync
                const newOrder = {
                    id: data.orderId || `ORD-${Date.now()}`,
                    customer: customerName,
                    items: items.map(i => ({
                        name: i.name,
                        details: i.options ? `${i.options.size}, ${i.options.milk}` : "Standard"
                    })),
                    total: cartTotal,
                    status: "pending",
                    time: "Just now"
                };

                const existingOrders = JSON.parse(localStorage.getItem("kira_orders") || "[]");
                localStorage.setItem("kira_orders", JSON.stringify([newOrder, ...existingOrders]));

                // Open new tab
                window.open(data.paymentUrl, '_blank');
                // Set Waiting State
                setLoading(false);
                setWaitingForPayment(true);
            } else {
                throw new Error("No payment URL received");
            }

        } catch (err: any) {
            setError(err.message || "Something went wrong");
            setLoading(false);
        }
    };

    if (waitingForPayment) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--kira-cream)] p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-lg max-w-sm w-full flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[var(--kira-green)] animate-spin" />
                    <h2 className="text-xl font-bold text-gray-900">Payment in Progress</h2>
                    <p className="text-sm text-gray-500">
                        We've opened a new tab for you to complete your payment with KIRA Pay.
                    </p>
                    <div className="flex flex-col gap-3 w-full mt-4">
                        <button
                            onClick={() => window.location.href = '/payment/success'}
                            className="w-full bg-[var(--kira-green)] text-white py-3 rounded-xl font-semibold"
                        >
                            I've Completed Payment
                        </button>
                        <button
                            onClick={() => setWaitingForPayment(false)}
                            className="w-full text-gray-400 text-sm font-medium"
                        >
                            Cancel / Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--kira-cream)] p-4">
                <h1 className="text-3xl font-bold text-[var(--kira-text)] mb-4">Your cart is empty</h1>
                <Link href="/" className="text-[var(--kira-green)] hvoer:underline">Go back to menu</Link>
            </main>
        );
    }

    const total = cartTotal;

    return (
        <main className="min-h-screen bg-[#F5F5F5] pb-48">
            {/* Header */}
            <header className="bg-white px-4 py-4 flex items-center sticky top-0 z-10">
                <Link href="/" className="absolute left-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Link>
                <h1 className="text-lg font-semibold text-gray-900 w-full text-center">Checkout</h1>
            </header>

            <div className="p-4 flex flex-col gap-4 max-w-lg mx-auto">

                {/* Order Summary */}
                <section>
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Order Summary</h2>
                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <div key={item.cartId} className="flex items-center gap-3 bg-white p-3 rounded-2xl">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                    {item.options && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {item.options.size} • {item.options.milk} Milk
                                        </p>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className="font-semibold text-gray-900 text-sm">${item.totalPrice.toFixed(2)}</span>
                                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pickup Time */}
                <section>
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Pickup Time</h2>
                    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                            <Clock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">Today, {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                            <p className="text-xs text-gray-500">Ready in ~15 min</p>
                        </div>
                        <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
                    </div>
                </section>

                {/* Pickup Name */}
                <section>
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Name for Order</h2>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[var(--kira-green)]/20 outline-none transition-all placeholder:text-gray-400 text-sm"
                    />
                </section>

                {/* Payment Method */}
                <section>
                    <h2 className="text-base font-semibold text-gray-900 mb-3">Payment Method</h2>
                    <div className="bg-white p-4 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--kira-green)] flex items-center justify-center text-white font-bold text-sm">
                            K
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">KIRA Pay</p>
                            <p className="text-xs text-gray-500">Crypto Payment</p>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-[var(--kira-green)] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl text-center">
                        {error}
                    </div>
                )}
            </div>

            {/* Fixed Bottom Payment Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-20">
                <div className="max-w-lg mx-auto flex flex-col gap-4">
                    {/* Total */}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-[var(--kira-green)]">${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-[var(--kira-green)] text-white py-4 rounded-full font-semibold text-base hover:bg-[#004d40] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Pay ${total.toFixed(2)}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </main>
    );
}
