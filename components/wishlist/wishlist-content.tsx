"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import { removeFromWishlistClient } from "@/lib/supabase/wishlist-client";
import { WishlistItem } from "./wishlist-item";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { WishlistContentProps } from "@/types/wishlist";
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

export function WishlistContent({ items, userId }: WishlistContentProps) {
  const router = useRouter();
  const w = messages.wishlist;
  const c = messages.common;
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);

  const handleRemoveClick = (productId: string, productName: string) => {
    setRemoveTarget({ id: productId, name: productName });
  };

  const handleRemoveConfirm = async () => {
    if (!removeTarget) return;

    const productId = removeTarget.id;
    setRemoveTarget(null);

    try {
      await removeFromWishlistClient(userId, productId);
      toast.success(w.removedFromWishlist);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error));
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">{w.emptyTitle}</h2>
        <p className="text-muted-foreground mb-6">
          {w.emptyHint}
        </p>
        <Button asChild>
          <Link href="/products">{c.browseProducts}</Link>
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <WishlistItem
            key={item.id}
            id={item.id}
            product={item.products}
            onRemove={(productId) => {
              const name = items.find((i) => i.products?.id === productId)?.products?.name ?? "";
              handleRemoveClick(productId, name);
            }}
          />
        ))}
      </div>

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => !open && setRemoveTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{w.confirmRemove}</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget
                ? `Sigur vrei să elimini „${removeTarget.name}" din lista de dorințe?`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{c.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {w.remove}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

