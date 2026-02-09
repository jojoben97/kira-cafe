import { NextResponse } from "next/server";

const KIRAPAY_API_URL = process.env.KIRAPAY_API_URL || "https://api.kira-pay.com/api";
const API_KEY = process.env.KIRAPAY_API_KEY!;
const PAYMENT_SUCCESS_URL = process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL || "http://localhost:3000/payment/success";

// Cache the receiver address (fetched from KiraPay account)
let cachedReceiver: string | null = null;

async function getReceiverAddress(): Promise<string> {
    if (cachedReceiver) return cachedReceiver;

    // Fetch receiver from existing links (inherits from KiraPay dashboard settings)
    const response = await fetch(`${KIRAPAY_API_URL}/link?page=1&limit=1`, {
        headers: { "x-api-key": API_KEY }
    });

    if (response.ok) {
        const data = await response.json();
        if (data.data?.links?.[0]?.receiver) {
            cachedReceiver = data.data.links[0].receiver;
            return cachedReceiver!;
        }
        // If no existing links, get from project settings
        if (data.data?.links?.[0]?.project?.address) {
            cachedReceiver = data.data.links[0].project.address;
            return cachedReceiver!;
        }
    }

    throw new Error("Could not fetch receiver address from KiraPay");
}

export async function POST(request: Request) {
    try {
        // Check if API key is configured
        if (!API_KEY) {
            console.error("KIRAPAY_API_KEY is not configured");
            return NextResponse.json(
                { error: "Payment gateway not configured" },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { items, customerName, totalAmount } = body;

        // Check minimum order amount (KiraPay requires at least $5)
        if (totalAmount < 5) {
            return NextResponse.json(
                { error: "Minimum order amount is $5.00" },
                { status: 400 }
            );
        }

        // Create a unique order ID
        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Build a descriptive name for the payment
        const itemSummary = items.map((item: { name: string; quantity: number }) =>
            `${item.quantity}x ${item.name}`
        ).join(', ');
        const paymentName = `${customerName || 'Guest'} - ${itemSummary}`;

        // Build formatted name for customOrderId
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }).replace(/\//g, '');
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '');
        const formattedName = `${customerName || 'Guest'}_${orderId}_${dateStr}_${timeStr}`;

        // Get receiver address dynamically from KiraPay account
        const receiver = await getReceiverAddress();

        // Payload for KIRA Pay API
        const payload = {
            receiver,
            price: totalAmount,
            name: paymentName,
            customOrderId: formattedName,
            redirectUrl: PAYMENT_SUCCESS_URL,
            type: "single_use",
            tokenOut: {
                chainId: "8453",
                address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
            }
        };

        console.log("Initiating payment with payload:", payload);

        const response = await fetch(`${KIRAPAY_API_URL}/link/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = errorText;
            }

            console.error("KIRA Pay API Error:", errorData);
            return NextResponse.json(
                { error: "Failed to create payment session", details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("KIRA Pay Response:", data);

        // KIRA Pay response format: { message: "success", data: { url: "..." }, code: 201 }
        // We need to handle both potential formats (direct object or nested in data)
        const paymentUrl = data.data?.url || data.url || data.shortUrl || (data.code ? `https://app.kira-pay.com/pay/${data.code}` : null);

        if (!paymentUrl) {
            console.error("No payment URL found in response:", data);
            return NextResponse.json({ error: "Invalid response from Payment Gateway" }, { status: 502 });
        }

        return NextResponse.json({
            success: true,
            paymentUrl: paymentUrl,
            orderId: orderId
        });

    } catch (error) {
        console.error("Payment API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
