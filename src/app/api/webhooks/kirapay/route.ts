import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { findPendingOrderIdByAmount, getLatestPendingOrderId, getOrderStore } from "@/lib/orderStore";

const WEBHOOK_SECRET = process.env.KIRAPAY_WEBHOOK_SECRET!;
const SIGNATURE_HEADER = "x-kirapay-signature";
const TIMESTAMP_HEADER = "x-kirapay-timestamp";
const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string, timestamp?: string): boolean {
    if (!secret) {
        console.error("KIRAPAY_WEBHOOK_SECRET not configured");
        return false;
    }
    if (!signature) {
        console.error("Missing webhook signature");
        return false;
    }

    // Accept header format: "sha256=<base64>"
    const received = signature.startsWith("sha256=") ? signature.slice(7) : signature;

    // Optional timestamp replay protection
    if (timestamp) {
        const tsRaw = Number(timestamp);
        if (!Number.isFinite(tsRaw)) {
            console.error("Invalid webhook timestamp");
            return false;
        }
        const tsSeconds = tsRaw > 1e12 ? Math.floor(tsRaw / 1000) : Math.floor(tsRaw);
        const now = Math.floor(Date.now() / 1000);
        const delta = Math.abs(now - tsSeconds);
        if (delta > TIMESTAMP_TOLERANCE_SECONDS) {
            console.error("Webhook timestamp outside tolerance");
            return false;
        }
    }

    // Canonical: if timestamp is provided, use "timestamp.payload"
    // Otherwise fallback to raw payload.
    const message = timestamp ? `${timestamp}.${payload}` : payload;
    const expected = crypto.createHmac("sha256", secret).update(message).digest("base64");

    // Timing-safe compare
    const receivedBuf = Buffer.from(received);
    const expectedBuf = Buffer.from(expected);
    if (receivedBuf.length !== expectedBuf.length) {
        return false;
    }
    return crypto.timingSafeEqual(receivedBuf, expectedBuf);
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = (request.headers.get(SIGNATURE_HEADER) || "").trim();
        const timestamp = (request.headers.get(TIMESTAMP_HEADER) || "").trim();

        console.log(WEBHOOK_SECRET)

        if (!WEBHOOK_SECRET) {
            return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
        }

        if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET, timestamp)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(payload);
        console.log("Webhook event:", JSON.stringify(event, null, 2));

        const eventType: string | undefined = event.type || event.event;
        const data = event.data || {};

        // Extract orderId from customOrderId (format: Name_ORD-xxx_date_time)
        // The orderId is the part that starts with "ORD-"
        const extractOrderId = (customOrderId: string): string => {
            if (!customOrderId) return "";
            const match = customOrderId.match(/(ORD-[^_]+)/);
            return match ? match[1] : customOrderId;
        };

        const customOrderId =
            data.customOrderId ||
            data.orderId ||
            data.link?.customOrderId ||
            data.linkCode ||
            "";
        let orderId = extractOrderId(customOrderId);
        const orderStore = getOrderStore();
        if (!orderId) {
            const amount = data.amount != null ? String(data.amount) : "";
            if (amount) {
                const matched = findPendingOrderIdByAmount(amount);
                if (matched) {
                    orderId = matched;
                }
            }
        }
        if (!orderId) {
            orderId = getLatestPendingOrderId() || "";
        }
        console.log(`Extracted orderId: ${orderId} from customOrderId: ${customOrderId}`);

        switch (eventType) {
            case "transaction.created":
                console.log(`Transaction created: ${data.transactionId} for order ${orderId}`);
                // Update order status to processing
                if (orderId) {
                    orderStore.set(orderId, {
                        id: data.transactionId,
                        customOrderId: data.customOrderId,
                        status: "pending",
                        amount: String(data.amount),
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
                        amount: String(data.amount || data.settlementAmount),
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
                        amount: String(data.amount),
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
                        amount: String(data.amount),
                        transactionId: data.transactionId,
                    });
                }
                break;

            default:
                console.log(`Unknown event type: ${eventType || "undefined"}`);
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

    const orderStore = getOrderStore();
    const order = orderStore.get(orderId);

    if (!order) {
        return NextResponse.json({ status: "not_found" });
    }

    return NextResponse.json(order);
}
