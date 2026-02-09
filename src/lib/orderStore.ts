export interface OrderData {
    id: string;
    customOrderId: string;
    status: "pending" | "completed" | "failed" | "refunded";
    amount: string;
    transactionId?: string;
    paidAt?: string;
    customer?: string;
}

declare global {
    // eslint-disable-next-line no-var
    var orderStore: Map<string, OrderData> | undefined;
    // eslint-disable-next-line no-var
    var latestPendingOrderId: string | undefined;
}

export function getOrderStore(): Map<string, OrderData> {
    if (!global.orderStore) {
        global.orderStore = new Map<string, OrderData>();
    }
    return global.orderStore;
}

export function setLatestPendingOrderId(orderId: string) {
    global.latestPendingOrderId = orderId;
}

export function getLatestPendingOrderId(): string | undefined {
    return global.latestPendingOrderId;
}

export function findPendingOrderIdByAmount(amount: string): string | null {
    const store = getOrderStore();
    const entries = Array.from(store.entries());
    const candidates = entries
        .map(([orderId, order]) => ({ orderId, order }))
        .filter(({ order }) => order.status === "pending" && order.amount === amount);

    if (candidates.length === 0) return null;

    // Pick the most recently created orderId (larger timestamp if using ORD-<ts>-<rand>)
    candidates.sort((a, b) => (a.orderId < b.orderId ? 1 : -1));
    return candidates[0].orderId;
}
