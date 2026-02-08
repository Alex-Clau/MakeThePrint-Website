"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { addToWishlistClient, removeFromWishlistClient } from "@/lib/supabase/wishlist-client";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { ProductCardActionsProps } from "@/types/product-components";
import { useTranslations } from "@/components/locale-provider";

export function ProductCardActions({
  productId,
  isInWishlist = false,
  showWishlistOnly = false,
  showCartOnly = false,
}: ProductCardActionsProps) {
  const router = useRouter();
  const t = useTranslations().product;
  const w = useTranslations().wishlist;
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [inWishlist, setInWishlist] = useState(isInWishlist);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigate to product page instead of adding to cart
    router.push(`/products/${productId}`);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsTogglingWishlist(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error(w.signInToAdd);
        router.push("/auth/login");
        return;
      }

      if (inWishlist) {
        await removeFromWishlistClient(user.id, productId);
        setInWishlist(false);
        toast.success(w.removedFromWishlist);
      } else {
        await addToWishlistClient(user.id, productId);
        setInWishlist(true);
        toast.success(w.addedToWishlist);
      }
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  if (showWishlistOnly) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="bg-background/80 hover:bg-background touch-manipulation"
        onClick={handleToggleWishlist}
        disabled={isTogglingWishlist}
      >
        <Heart
          className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
        />
      </Button>
    );
  }

  if (showCartOnly) {
    return (
      <Button
        size="sm"
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto touch-manipulation"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden min-[375px]:inline">{t.addToCart}</span>
        <span className="min-[375px]:hidden">{t.addToCartShort}</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="bg-background/80 hover:bg-background touch-manipulation"
        onClick={handleToggleWishlist}
        disabled={isTogglingWishlist}
      >
        <Heart
          className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
        />
      </Button>
      <Button
        size="sm"
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm w-full sm:w-auto touch-manipulation"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden min-[375px]:inline">{t.addToCart}</span>
        <span className="min-[375px]:hidden">{t.addToCartShort}</span>
      </Button>
    </>
  );
}

