"use client";

import { useState, useEffect } from "react";
import { Coffee, ClipboardList, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";

// Mock Data for Admin (Initial State)
const initialMockOrders = [
    {
        id: "ORD-1234",
        customer: "Alice Johnson",
        items: [
            { name: "Cappuccino", details: "Medium, Oat Milk" },
            { name: "Pastry", details: "Croissant" }
        ],
        total: 12.50,
        status: "pending",
        time: "2 mins ago"
    },
    {
        id: "ORD-1235",
        customer: "Bob Smith",
        items: [
            { name: "Espresso", details: "Double Shot" }
        ],
        total: 3.00,
        status: "completed",
        time: "10 mins ago"
    }
];

// Full Menu Data to sync with MobileOrderView
const fullMenu = [
    // Coffee
    { name: "Espresso", price: 3.00, category: "Coffee", image: "https://images.unsplash.com/photo-1501527904397-0801af7b5d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Cappuccino", price: 4.00, category: "Coffee", image: "https://images.unsplash.com/photo-1746281673841-31a64ca33ef1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Flat White", price: 4.50, category: "Coffee", image: "https://images.unsplash.com/photo-1742654230335-7575b03fff91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Mocha", price: 5.00, category: "Coffee", image: "https://images.unsplash.com/photo-1749104028327-a33087ea4f47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Cold Brew", price: 4.00, category: "Coffee", image: "https://images.unsplash.com/photo-1596078841463-5504c992222f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTE0MjV8&ixlib=rb-4.1.0&q=80&w=1080" },
    // Tea
    { name: "Matcha Latte", price: 5.00, category: "Tea", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM1Mjl8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Earl Grey", price: 3.50, category: "Tea", image: "https://images.unsplash.com/photo-1627820751275-fcc1b56956dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM1Mjh8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Chai Latte", price: 4.50, category: "Tea", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM1Mjh8&ixlib=rb-4.1.0&q=80&w=1080" },
    // Smoothies
    { name: "Berry Blast", price: 6.00, category: "Smoothies", image: "https://images.unsplash.com/photo-1628557044797-f21a17b96c89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM2MTB8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Green Glow", price: 6.50, category: "Smoothies", image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM2MTB8&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Mango Madness", price: 6.00, category: "Smoothies", image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTM2MTB8&ixlib=rb-4.1.0&q=80&w=1080" },
    // Others
    { name: "Sky Juice", price: 0.50, category: "Others", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4NDM0ODN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NzAwNTQwMjN8&ixlib=rb-4.1.0&q=80&w=1080" },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState<any[]>(initialMockOrders);

    // Sync with Local Storage on mount
    useEffect(() => {
        const storedOrders = localStorage.getItem("kira_orders");
        if (storedOrders) {
            try {
                const parsedOrders = JSON.parse(storedOrders);
                // Merge stored orders with mock orders, avoiding duplicates if any logic existed (simple prepend here)
                setOrders(prev => [...parsedOrders, ...prev]);
            } catch (e) {
                console.error("Failed to parse orders", e);
            }
        }
    }, []);

    // Helper to clear history
    const clearHistory = () => {
        localStorage.removeItem("kira_orders");
        setOrders(initialMockOrders);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col hidden md:flex">
                <div className="flex items-center gap-2 mb-10">
                    <Coffee className="w-6 h-6 text-[var(--kira-green)]" />
                    <span className="text-xl font-bold">KIRA Admin</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "orders" ? "bg-[var(--kira-cream)] text-[var(--kira-green)]" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab("menu")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "menu" ? "bg-[var(--kira-cream)] text-[var(--kira-green)]" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <Coffee className="w-5 h-5" />
                        Menu Items
                    </button>
                </nav>
            </aside>

            {/* content */}
            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">{activeTab === "orders" ? "Incoming Orders" : "Menu Management"}</h1>
                        {activeTab === "orders" && (
                            <div className="flex gap-4">
                                <button onClick={clearHistory} className="text-xs text-red-500 underline self-center mr-4">Clear History</button>
                                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Today's Revenue</span>
                                    <span className="text-xl font-bold text-[var(--kira-green)]">$452.00</span>
                                </div>
                                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex flex-col">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Active Orders</span>
                                    <span className="text-xl font-bold text-orange-500">{orders.length}</span>
                                </div>
                            </div>
                        )}
                        {activeTab === "menu" && (
                            <button className="bg-[var(--kira-green)] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#004d40] transition-colors">
                                + Add New Item
                            </button>
                        )}
                    </header>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {activeTab === "orders" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order ID</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Items</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Total</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order, idx) => (
                                            <tr key={order.id + idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 font-mono text-sm text-gray-600">{order.id}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{order.customer}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        {order.items.map((item: any, i: number) => (
                                                            <div key={i} className="text-sm">
                                                                <span className="font-medium text-gray-800">{item.name}</span>
                                                                <span className="text-gray-500 text-xs ml-1">{item.details}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-orange-50 text-orange-700 border-orange-100'
                                                        }`}>
                                                        {order.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{order.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Image</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {fullMenu.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-gray-600">${item.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-3">
                                                <button className="text-sm text-blue-600 hover:underline">Edit</button>
                                                <button className="text-sm text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
