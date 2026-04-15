"use client";

import { useState } from "react";
import { updateOrderStatusFormAction } from "@/app/(auth)/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ADMIN_ORDER_STATUSES, isAdminOrderStatus } from "@/lib/constants/admin-order-status";
import { messages } from "@/lib/messages";
import { orderStatusLabelRo } from "@/lib/utils/order-status-ui";
import type { OrderStatusFormProps } from "@/types/admin";

export function OrderStatusForm({
  orderId,
  currentStatus,
  currentTracking,
}: OrderStatusFormProps) {
  const t = messages.admin;
  const initial = isAdminOrderStatus(currentStatus) ? currentStatus : "pending";
  const [status, setStatus] = useState<string>(initial);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateOrderStatusFormAction(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground">{t.changeOrderStatusTitle}</h3>
      <form
        className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="status" value={status} />

        <div className="grid w-full gap-4 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-end">
          <div className="min-w-0 space-y-2 sm:min-w-[220px]">
            <Label htmlFor="admin-order-status" className="text-xs text-muted-foreground">
              {t.statusLabel}
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="admin-order-status" className="w-full sm:w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {orderStatusLabelRo(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-0 space-y-2 sm:min-w-[220px] lg:flex-1">
            <Label htmlFor="trackingNumber" className="text-xs text-muted-foreground">
              {t.trackingNumberLabel}
            </Label>
            <Input
              id="trackingNumber"
              name="trackingNumber"
              placeholder={t.optionalPlaceholder}
              defaultValue={currentTracking}
              className="w-full max-w-md"
            />
          </div>
        </div>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? t.updating : t.update}
        </Button>
      </form>
    </div>
  );
}
