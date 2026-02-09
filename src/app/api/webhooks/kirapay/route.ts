import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.KIRAPAY_WEBHOOK_SECRET!;

// In-memory store for demo purposes
// In production, use a database like MongoDB, PostgreSQL, Redis, or Vercel KV.
// Note: global/in-memory storage will not work reliably on Vercel (serverless).
declare global {
    var orderStore: Map<string, OrderData> | undefined;
}

interface OrderData {
    id: string;
    customOrderId: string;
    status: "pending" | "completed" | "failed" | "refunded";
    amount: string;
    transactionId?: string;
    paidAt?: string;
    customer?: string;
}

// Initialize global store
if (!global.orderStore) {
    global.orderStore = new Map<string, OrderData>();
}

const orderStore = global.orderStore;

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    if (!secret) {
        console.warn("KIRAPAY_WEBHOOK_SECRET not configured - skipping signature verification");
        return true; // Allow in development without secret
    }

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    // Use string comparison if timingsafe comparison is not possible due to length mismatch
    // But first, let's log the mismatch for debugging
    if (signature.length !== expectedSignature.length) {
        console.error(`Signature length mismatch: expected ${expectedSignature.length}, got ${signature.length}`);
        return false;
    }

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );
    } catch (e) {
        console.error("Error during timingSafeEqual:", e);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = (request.headers.get("x-kirapay-signature") || "").trim();
        const timestamp = request.headers.get("x-kirapay-timestamp") || "";

        console.log("Received webhook:", { timestamp, signaturePresent: !!signature });

        // Verify signature (skip if secret not configured for development)
        if (WEBHOOK_SECRET && !verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
            console.error("Invalid webhook signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(payload);
        console.log("Webhook event:", JSON.stringify(event, null, 2));

        const { event: eventType, data } = event;

        // Extract orderId from customOrderId (format: Name_ORD-xxx_date_time)
        // The orderId is the part that starts with "ORD-"
        const extractOrderId = (customOrderId: string): string => {
            if (!customOrderId) return "";
            const match = customOrderId.match(/(ORD-[^_]+)/);
            return match ? match[1] : customOrderId;
        };

        const orderId = extractOrderId(data.customOrderId);
        console.log(`Extracted orderId: ${orderId} from customOrderId: ${data.customOrderId}`);

        switch (eventType) {
            case "transaction.created":
                console.log(`Transaction created: ${data.transactionId} for order ${orderId}`);
                // Update order status to processing
                if (orderId) {
                    orderStore.set(orderId, {
                        id: data.transactionId,
                        customOrderId: data.customOrderId,
                        status: "pending",
                        amount: data.amount,
                        transactionId: data.transactionId,
                    });
                }
                break;

            case "transaction.succeeded":
                console.log(`Transaction succeeded: ${data.transactionId} for order ${orderId}`);
                // Update order status to completed
                if (orderId) {
                    const existingOrder = orderStore.get(orderId);
                    orderStore.set(orderId, {
                        ...existingOrder,
                        id: data.transactionId,
                        customOrderId: data.customOrderId,
                        status: "completed",
                        amount: data.amount || data.settlementAmount,
                        transactionId: data.transactionId,
                        paidAt: new Date().toISOString(),
                    });
                    console.log(`Order ${orderId} marked as completed`);
                }
                break;

            case "transaction.failed":
                console.log(`Transaction failed: ${data.transactionId} for order ${orderId}`);
                if (orderId) {
                    const existingOrder = orderStore.get(orderId);
                    orderStore.set(orderId, {
                        ...existingOrder,
                        id: data.transactionId,
                        customOrderId: data.customOrderId,
                        status: "failed",
                        amount: data.amount,
                        transactionId: data.transactionId,
                    });
                }
                break;

            case "transaction.refund":
                console.log(`Transaction refunded: ${data.transactionId} for order ${orderId}`);
                if (orderId) {
                    const existingOrder = orderStore.get(orderId);
                    orderStore.set(orderId, {
                        ...existingOrder,
                        id: data.transactionId,
                        customOrderId: data.customOrderId,
                        status: "refunded",
                        amount: data.amount,
                        transactionId: data.transactionId,
                    });
                }
                break;

            default:
                console.log(`Unknown event type: ${eventType}`);
        }

        return NextResponse.json({ received: true, event: eventType });

    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        );
    }
}

// GET endpoint to check order status (for frontend polling)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
        return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const order = orderStore.get(orderId);

    if (!order) {
        return NextResponse.json({ status: "not_found" });
    }

    return NextResponse.json(order);
}
