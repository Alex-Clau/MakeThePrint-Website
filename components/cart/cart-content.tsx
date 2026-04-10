"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import {
  updateCartItemClient,
  removeFromCartClient,
} from "@/lib/supabase/cart-client";
import { CartContentProps, CartItem } from "@/types/cart";
import { CartItemsList } from "./cart-items-list";
import { CartSummary } from "./cart-summary";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { messages } from "@/lib/messages";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function CartContent({ items: initialItems }: CartContentProps) {
  const t = messages.cart;
  const c = messages.common;
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [removeTarget, setRemoveTarget] = useState<{ cartItemId: string; productName: string } | null>(null);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const prevItems = items;
    setItems((current) =>
      current.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
    window.dispatchEvent(new CustomEvent("cart-updated"));
    updateCartItemClient(cartItemId, newQuantity).catch((error: unknown) => {
      setItems(prevItems);
      toast.error(getUserFriendlyError(error));
    });
  };

  const handleRemoveClick = (cartItemId: string, productName: string) => {
    setRemoveTarget({ cartItemId, productName });
  };

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;

    const { cartItemId } = removeTarget;
    setRemoveTarget(null);
    const removedItem = items.find((i) => i.id === cartItemId);
    const prevItems = items;
    setItems((current) => current.filter((item) => item.id !== cartItemId));
    window.dispatchEvent(new CustomEvent("cart-updated"));

    try {
      await removeFromCartClient(cartItemId);
      toast.success(t.itemRemoved);
    } catch (error: unknown) {
      if (removedItem) {
        setItems(prevItems);
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
      toast.error(getUserFriendlyError(error));
    }
  };

  const subtotal = items.reduce((sum, item) => {
    // Preset (configurable): line total is totalPrice * quantity
    if (item.customizations?.totalPrice != null) {
      return sum + item.customizations.totalPrice * item.quantity;
    }
    return sum + (item.products?.price ?? 0) * item.quantity;
  }, 0);
  const total = subtotal;

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <CartItemsList
            items={items}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveClick}
          />
        </div>
        <div className="lg:col-span-1">
          <CartSummary subtotal={subtotal} total={total} />
        </div>
      </div>

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmRemove}</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget
                ? `Sigur vrei să elimini „${removeTarget.productName}" din coș?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{c.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.remove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

