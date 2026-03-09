"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Plus, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailFormProps } from "@/types/components";
import { addToCartClient } from "@/lib/supabase/cart-client";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { CustomLettersForm } from "./custom-letters-form";
import { ProductCardActions } from "./product-card-actions";
import { KeychainConfig } from "@/types/product";
import { getProductDisplayName } from "@/lib/utils/products";
import { messages } from "@/lib/messages";

export function ProductDetailForm({
  product,
  previewText = "",
  onPreviewChange,
  averageRating = 0,
  totalReviews = 0,
  isInWishlist = false,
}: ProductDetailFormProps) {
  const displayName = getProductDisplayName(product);
  const t = messages.product;
  const c = messages.common;
  const r = messages.reviews;
  const router = useRouter();
  const category = product.category as string | undefined;
  const isPreset = category === "preset";
  const isInquire = category === "inquire" || category === "keychains";

  const [quantity, setQuantity] = useState(1);

  const customProductConfig = isPreset && product.custom_config && "defaultFont" in product.custom_config
    ? product.custom_config
    : null;
  const inquireConfig = isInquire && product.custom_config && "whatsappNumber" in product.custom_config
    ? (product.custom_config as KeychainConfig)
    : null;

  const [customConfig, setCustomConfig] = useState<{
    text: string;
    characterCount: number;
    font: string;
    color: string;
    size: string;
    totalPrice: number;
    isOutdoor?: boolean;
    isLedStrip?: boolean;
    isColor?: boolean;
  }>({
    text: "",
    characterCount: 0,
    font: customProductConfig?.defaultFont || customProductConfig?.fonts?.[0] || "",
    color: customProductConfig?.colors?.[0] || "black",
    size: "",
    totalPrice: 0,
  });

  const [isAdding, setIsAdding] = useState(false);

  const totalPrice = isPreset
    ? customConfig.totalPrice
    : product.price * quantity;
  const maxQuantity = 10; // Limit to 10 per order

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > maxQuantity) return maxQuantity;
      return newQuantity;
    });
  };

  const handleWhatsAppInquiry = () => {
    const phoneNumber = inquireConfig?.whatsappNumber;
    
    if (!phoneNumber) {
      toast.error(t.whatsappNotConfigured);
      return;
    }

    // Use custom message or default, replace {product_name} placeholder
    const messageTemplate = inquireConfig?.whatsappMessage || 
      `Hi! I'm interested in the {product_name}. Can you provide more details about customization options?`;
    
    const message = messageTemplate.replace(/{product_name}/g, displayName);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success(t.openingWhatsApp);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      await addToCartClient({
        user_id: user.id,
        product_id: product.id,
        quantity: isPreset ? 1 : quantity,
        customizations: isPreset ? {
          text: customConfig.text,
          font: customConfig.font,
          color: customConfig.color,
          size: customConfig.size,
          characterCount: customConfig.characterCount,
          totalPrice: customConfig.totalPrice,
          isOutdoor: customConfig.isOutdoor,
          isLedStrip: customConfig.isLedStrip,
          isColor: customConfig.isColor,
        } : undefined,
      });

      toast.success(t.addedToCart);
      // Dispatch custom event to refresh cart count
      window.dispatchEvent(new CustomEvent("cart-updated"));
      router.push("/cart");
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsAdding(false);
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayName,
          url,
        });
        toast.success(t.shared);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(url);
          toast.success(t.linkCopied);
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(t.linkCopied);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8">
      {/* Product Name & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-2 lg:mb-3 text-accent-primary-dark">
          {displayName}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-3 sm:mb-4 lg:mb-5">
          {product.description}
        </p>
      </div>

      {/* Compact rating summary */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-base ${
                i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
          <span className="font-semibold">
            {averageRating.toFixed(2)} {r.outOf5}
          </span>
        </div>
        <a
          href="#reviews"
          className="text-muted-foreground hover:text-accent-primary-dark underline underline-offset-2"
        >
          {r.basedOn} {totalReviews} {totalReviews === 1 ? r.review : r.reviews}
        </a>
      </div>

      {/* Inquire - Show inquiry/contact CTA only */}
      {isInquire ? (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 bg-accent-primary/10 rounded-lg border-2 border-accent-primary/30">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-accent-primary-dark">
              {t.keychainTitle}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {t.keychainDesc}
            </p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-accent-primary-dark">•</span>
                <span>{t.keychainBullet1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary-dark">•</span>
                <span>{t.keychainBullet2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary-dark">•</span>
                <span>{t.keychainBullet3}</span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {inquireConfig?.whatsappNumber ? (
              <Button
                size="lg"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-base sm:text-base py-4 sm:py-5 lg:py-6 touch-manipulation"
                onClick={handleWhatsAppInquiry}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {t.inquireWhatsApp}
              </Button>
            ) : null}
            <div className="flex items-center gap-2">
              <ProductCardActions
                productId={product.id}
                showWishlistOnly
                isInWishlist={isInWishlist}
              />
              <Button variant="outline" size="icon" onClick={handleShare} title={t.share}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : isPreset ? (
        <>
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">
              {totalPrice.toFixed(2)} {c.ron}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t.priceVariesBySize}
              {customConfig.characterCount > 0 && (
                <span className="ml-1">
                  • {customConfig.characterCount} {customConfig.characterCount === 1 ? t.character : t.characters}
                </span>
              )}
            </p>
          </div>
          <CustomLettersForm
            availableFonts={customProductConfig?.fonts ?? []}
            customConfig={product.custom_config || {}}
            text={previewText}
            onTextChange={(text) =>
              onPreviewChange?.({
                text,
                font: customConfig.font,
                color: customConfig.color,
                size: customConfig.size,
              })
            }
            onConfigChange={(config) => {
              setCustomConfig(config);
              onPreviewChange?.({
                text: config.text,
                font: config.font,
                color: config.color,
                size: config.size,
              });
            }}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white text-base sm:text-base py-4 sm:py-5 lg:py-6 touch-manipulation"
              onClick={handleAddToCart}
              disabled={isAdding || customConfig.totalPrice === 0}
            >
              {isAdding ? t.adding : customConfig.characterCount === 0 && !customConfig.size ? t.enterTextToContinue : t.addToCart}
            </Button>
            <div className="flex items-center gap-2">
              <ProductCardActions
                productId={product.id}
                showWishlistOnly
                isInWishlist={isInWishlist}
              />
              <Button variant="outline" size="icon" onClick={handleShare} title={t.share}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Price Display (finished / standard) */}
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">
              {totalPrice.toFixed(2)} {c.ron}
            </p>
            {quantity > 1 && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {product.price.toFixed(2)} {t.ronEach}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 lg:mb-4 block">{t.quantity}</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 touch-manipulation"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="flex-1 sm:w-16 text-center font-semibold text-base sm:text-lg">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 touch-manipulation"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* Add to Cart Button + secondary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1 bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white text-base sm:text-base py-4 sm:py-5 lg:py-6 touch-manipulation"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? t.adding : t.addToCart}
            </Button>
            <div className="flex items-center gap-2">
              <ProductCardActions
                productId={product.id}
                showWishlistOnly
                isInWishlist={isInWishlist}
              />
              <Button variant="outline" size="icon" onClick={handleShare} title={t.share}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

