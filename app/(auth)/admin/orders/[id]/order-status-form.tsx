"use client";

import { updateOrderStatusFormAction } from "@/app/(auth)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormStatus } from "react-dom";
import { ADMIN_ORDER_STATUSES, isAdminOrderStatus } from "@/lib/constants/admin-order-status";
import { messages } from "@/lib/messages";
import type { OrderStatusFormProps } from "@/types/admin";

function SubmitButton({ idleLabel, pendingLabel }: { idleLabel: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

export function OrderStatusForm({
  orderId,
  currentStatus,
  currentTracking,
}: OrderStatusFormProps) {
  const t = messages.admin;

  return (
    <form
      className="flex flex-wrap items-end gap-4 rounded-lg border p-4"
      action={updateOrderStatusFormAction}
    >
      <input
        type="hidden"
        name="orderId"
        value={orderId}
      />
      <div className="space-y-2">
        <Label htmlFor="status">{t.statusLabel}</Label>
        <select
          id="status"
          name="status"
          defaultValue={isAdminOrderStatus(currentStatus) ? currentStatus : "pending"}
          className="h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          {ADMIN_ORDER_STATUSES.map((s) => (
            <option
              key={s}
              value={s}
            >
              {s.charAt(0)
                .toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="trackingNumber">{t.trackingNumberLabel}</Label>
        <Input
          id="trackingNumber"
          name="trackingNumber"
          placeholder={t.optionalPlaceholder}
          defaultValue={currentTracking}
          className="w-48"
        />
      </div>
      <SubmitButton idleLabel={t.update} pendingLabel={t.updating} />
    </form>
  );
}
