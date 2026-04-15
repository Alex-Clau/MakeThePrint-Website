const INACTIVE_ORDER_STATUSES = new Set(["failed", "cancelled", "canceled"]);
const SUCCESS_ORDER_STATUSES = new Set(["confirmed", "shipped", "delivered"]);

export type OrderConfirmationDerivedState = {
  paymentStatus: string;
  isPaid: boolean;
  isAwaitingPayment: boolean;
  lifecycleStatus: string;
  isInactiveOrder: boolean;
  isProcessingOrder: boolean;
  showPaidSuccessHero: boolean;
};

/**
 * Pure derived UI state for checkout confirmation from persisted order fields.
 */
export function getOrderConfirmationDerivedState(order: {
  payment_status?: string | null;
  status?: string | null;
}): OrderConfirmationDerivedState {
  const paymentStatus = order.payment_status ?? "pending";
  const isPaid = paymentStatus === "paid";
  const isAwaitingPayment = paymentStatus === "pending";
  const lifecycleStatus = (order.status ?? "").toLowerCase();
  const isInactiveOrder = INACTIVE_ORDER_STATUSES.has(lifecycleStatus);
  const isProcessingOrder =
    !isInactiveOrder && isPaid && (lifecycleStatus.length === 0 || lifecycleStatus === "pending");
  const showPaidSuccessHero = isPaid && SUCCESS_ORDER_STATUSES.has(lifecycleStatus);

  return {
    paymentStatus,
    isPaid,
    isAwaitingPayment,
    lifecycleStatus,
    isInactiveOrder,
    isProcessingOrder,
    showPaidSuccessHero,
  };
}
