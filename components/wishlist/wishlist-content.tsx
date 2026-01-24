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

export function WishlistContent({ items, userId }: WishlistContentProps) {
  const router = useRouter();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlistClient(userId, productId);
      toast.success("Removed from wishlist");
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start adding items to your wishlist
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
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

