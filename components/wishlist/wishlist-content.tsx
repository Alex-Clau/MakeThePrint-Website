"use client";

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
import { useTranslations } from "@/components/locale-provider";

export function WishlistContent({ items, userId }: WishlistContentProps) {
  const router = useRouter();
  const w = useTranslations().wishlist;
  const c = useTranslations().common;

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlistClient(userId, productId);
      toast.success(w.removedFromWishlist);
      router.refresh();
    } catch (error: any) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <WishlistItem
          key={item.id}
          id={item.id}
          product={item.products}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

