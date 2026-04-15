export const ADMIN_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
] as const;

export type AdminOrderStatus = (typeof ADMIN_ORDER_STATUSES)[number];

export function isAdminOrderStatus(value: string): value is AdminOrderStatus {
  return (ADMIN_ORDER_STATUSES as readonly string[]).includes(value);
}
