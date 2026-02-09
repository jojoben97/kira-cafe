"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Clock, Lock, Check, Coffee, ShoppingBag, MapPin } from "lucide-react";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
    const { items, cartTotal, clearCart, cartCount, setIsCartOpen } = useCart();
    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [waitingForPayment, setWaitingForPayment] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [pollingCount, setPollingCount] = useState(0);

    // Poll for payment status
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (waitingForPayment && currentOrderId) {
            interval = setInterval(async () => {
                try {
                    const response = await fetch(`/api/webhooks/kirapay?orderId=${currentOrderId}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === "completed") {
                            window.location.href = "/payment/success";
                        }
                    }
                } catch (err) {
                    console.error("Polling error:", err);
                }
            }, 3000); // Poll every 3 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [waitingForPayment, currentOrderId]);

    const checkPaymentStatus = async () => {
        if (!currentOrderId) return;
        setVerifying(true);
        setError("");

        try {
            const response = await fetch(`/api/webhooks/kirapay?orderId=${currentOrderId}`);
            const data = await response.json();

            if (data.status === "completed") {
                window.location.href = "/payment/success";
            } else if (data.status === "pending") {
                setError("Payment is still pending. Please complete the transaction in the other tab.");
            } else {
                setError("Payment status not found yet. Please wait a few moments after completing payment.");
            }
        } catch (err) {
            setError("Failed to verify payment status. Please try again.");
        } finally {
            setVerifying(false);
        }
    };

    const handlePayment = async () => {
        if (!customerName.trim()) {
            setError("Please enter your name for the order");
            return;
        }
        if (total < 5) {
            setError("Minimum order amount is $5.00");
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

            if (data.paymentUrl) {
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

                window.open(data.paymentUrl, '_blank');
                setCurrentOrderId(newOrder.id);
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

    const subtotal = cartTotal;
    const total = subtotal;

    // Waiting for payment state
    if (waitingForPayment) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--kira-cream)] p-4 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-lg max-w-sm w-full flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-[var(--kira-green)] animate-spin" />
                    <h2 className="text-xl font-bold text-gray-900">Complete Your Payment</h2>
                    <p className="text-sm text-gray-500">
                        Complete your payment in the KiraPay tab. You'll be redirected back here when done.
                    </p>
                    <p className="text-xs text-gray-400">
                        Order ID: {currentOrderId}
                    </p>
                    <div className="flex flex-col gap-3 w-full mt-4">
                        <button
                            disabled={verifying}
                            onClick={checkPaymentStatus}
                            className="w-full bg-[var(--kira-green)] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {verifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "I've Completed Payment"
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setWaitingForPayment(false);
                                setCurrentOrderId("");
                            }}
                            className="w-full text-gray-400 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    // Empty cart state
    if (items.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--kira-cream)] p-4">
                <h1 className="text-3xl font-bold text-[var(--kira-text)] mb-4">Your cart is empty</h1>
                <Link href="/order" className="text-[var(--kira-green)] hover:underline">Go back to menu</Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--kira-cream)] flex flex-col">
            {/* Mobile Header */}
            <header className="lg:hidden bg-white px-4 py-4 flex items-center sticky top-0 z-10 border-b border-[var(--kira-border)]">
                <Link href="/order" className="absolute left-4 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </Link>
                <h1 className="text-lg font-semibold text-gray-900 w-full text-center">Checkout</h1>
            </header>

            {/* Desktop Header */}
            <header className="hidden lg:flex items-center justify-between h-20 px-20 w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--kira-border)]">
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

            {/* Mobile Content */}
            <div className="lg:hidden flex-1 p-4 flex flex-col gap-4 pb-48">
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
                    </div>
                </section>

                {/* Name */}
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
                            <p className="font-medium text-gray-900 text-sm">KiraPay</p>
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

            {/* Desktop Content - Two Column Layout */}
            <div className="hidden lg:flex flex-1 gap-[60px] px-20 py-[60px]">
                {/* Left Column */}
                <div className="flex-1 flex flex-col gap-8">
                    {/* Page Title */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[32px] font-bold text-[var(--kira-text)]">Checkout</h1>
                        <p className="text-[15px] text-[var(--kira-text-secondary)]">Review your order and complete payment</p>
                    </div>

                    {/* Customer Details */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-[18px] font-semibold text-[var(--kira-text)]">Customer Details</h2>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-[var(--kira-text-secondary)]">Name</label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full p-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-[var(--kira-green)] focus:ring-2 focus:ring-[var(--kira-green)]/10 outline-none transition-all placeholder:text-gray-400 text-[15px]"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-[var(--kira-text-secondary)]">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full p-4 rounded-xl bg-white border border-[#E5E5E5] focus:border-[var(--kira-green)] focus:ring-2 focus:ring-[var(--kira-green)]/10 outline-none transition-all placeholder:text-gray-400 text-[15px]"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section className="flex flex-col gap-5">
                        <h2 className="text-[18px] font-semibold text-[var(--kira-text)]">Order Summary</h2>
                        <div className="flex flex-col gap-4">
                            {items.map((item) => (
                                <div key={item.cartId} className="flex items-center gap-4 bg-white p-4 rounded-2xl">
                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-[var(--kira-text)] text-[16px]">{item.name}</h4>
                                        {item.options && (
                                            <p className="text-[13px] text-[var(--kira-text-secondary)] mt-1">
                                                {item.options.size} • {item.options.milk} Milk
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="font-semibold text-[var(--kira-text)] text-[16px]">${item.totalPrice.toFixed(2)}</span>
                                        <p className="text-[13px] text-[var(--kira-text-secondary)]">x{item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pickup Details */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-[18px] font-semibold text-[var(--kira-text)]">Pickup Details</h2>
                        <div className="flex items-center gap-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-[13px] text-[var(--kira-text-secondary)]">Pickup Location</p>
                                    <p className="font-semibold text-[var(--kira-text)] text-[15px]">KIRA Cafe - Main Street</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                                    <Clock className="w-5 h-5 text-[var(--kira-green)]" />
                                </div>
                                <div>
                                    <p className="text-[13px] text-[var(--kira-text-secondary)]">Ready for Pickup</p>
                                    <p className="font-semibold text-[var(--kira-text)] text-[15px]">Today at {new Date(Date.now() + 15 * 60000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column */}
                <div className="w-[420px] flex flex-col gap-6">
                    {/* Payment Method */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-[18px] font-semibold text-[var(--kira-text)]">Payment Method</h2>
                        <div className="bg-white p-5 rounded-2xl flex items-center gap-4 border-2 border-[var(--kira-green)]">
                            <div className="w-12 h-12 rounded-full bg-[var(--kira-green)] flex items-center justify-center text-white font-bold text-lg">
                                K
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-[var(--kira-text)] text-[16px]">KiraPay</p>
                                <p className="text-[13px] text-[var(--kira-text-secondary)]">Crypto Payment</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-[var(--kira-green)] flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </section>

                    {/* Totals */}
                    <section className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[15px] text-[var(--kira-text-secondary)]">Subtotal</span>
                            <span className="text-[15px] font-medium text-[var(--kira-text)]">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-[#E5E5E5]" />
                        <div className="flex justify-between items-center">
                            <span className="text-[18px] font-semibold text-[var(--kira-text)]">Total</span>
                            <span className="text-[24px] font-bold text-[var(--kira-green)]">${total.toFixed(2)}</span>
                        </div>
                    </section>

                    {/* Minimum Order Warning */}
                    {total < 5 && (
                        <div className="bg-amber-50 text-amber-700 text-sm p-4 rounded-xl text-center">
                            Minimum order amount is $5.00. Add ${(5 - total).toFixed(2)} more to checkout.
                        </div>
                    )}

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading || total < 5}
                        className="w-full h-14 bg-[var(--kira-green)] text-white rounded-full font-semibold text-[16px] hover:bg-[#1f4a2f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
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

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Fixed Bottom Payment Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-20">
                <div className="flex flex-col gap-3">
                    {total < 5 && (
                        <div className="bg-amber-50 text-amber-700 text-xs p-2 rounded-lg text-center">
                            Min. order $5.00 — Add ${(5 - total).toFixed(2)} more
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-[var(--kira-green)]">${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={handlePayment}
                        disabled={loading || total < 5}
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

            {/* Desktop Footer */}
            <div className="hidden lg:block">
                <Footer />
            </div>
        </main>
    );
}
