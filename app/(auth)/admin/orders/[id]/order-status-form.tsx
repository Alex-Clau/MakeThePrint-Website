"use client";

import {updateOrderStatusFormAction} from "@/app/(auth)/admin/actions";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useTransition} from "react";
import {messages} from "@/lib/messages";
import type {OrderStatusFormProps} from "@/types/admin";

const STATUSES = ["pending", "confirmed", "shipped", "delivered"] as const;

export function OrderStatusForm({
                                  orderId,
                                  currentStatus,
                                  currentTracking,
                                }: OrderStatusFormProps) {
  const [isPending, startTransition] = useTransition();
  const t = messages.admin;

  return (
    <form
      className="flex flex-wrap items-end gap-4 rounded-lg border p-4"
      action={(formData) => {
        startTransition(() => {
          updateOrderStatusFormAction(formData);
        });
      }}
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
          defaultValue={currentStatus}
          className="h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
        >
          {STATUSES.map((s) => (
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
      <Button
        type="submit"
        disabled={isPending}
      >
        {isPending ? t.updating : t.update}
      </Button>
    </form>
  );
}
