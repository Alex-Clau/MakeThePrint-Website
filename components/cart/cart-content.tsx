"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  updateCartItemClient,
  removeFromCartClient,
} from "@/lib/supabase/cart-client";
import { CartContentProps } from "@/types/cart";
import { CartItemsList } from "./cart-items-list";
import { CartSummary } from "./cart-summary";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { useTranslations } from "@/components/locale-provider";

export function CartContent({ items }: CartContentProps) {
  const router = useRouter();
  const t = useTranslations().cart;
  const c = useTranslations().common;

  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItemClient(cartItemId, newQuantity);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    }
  };

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeFromCartClient(cartItemId);
      window.dispatchEvent(new CustomEvent("cart-updated"));
      toast.success(t.itemRemoved);
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.products.price.toString()) * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">{t.empty}</h2>
        <p className="text-muted-foreground mb-6">{t.emptyHint}</p>
        <Button asChild>
          <Link href="/products">{c.browseProducts}</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      <div className="lg:col-span-2">
        <CartItemsList
          items={items}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
        />
      </div>
      <div className="lg:col-span-1">
        <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
      </div>
    </div>
  );
}

