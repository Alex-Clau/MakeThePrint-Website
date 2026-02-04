"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Minus, Plus, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailFormProps } from "@/types/components";
import { addToCartClient } from "@/lib/supabase/cart-client";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { CustomLettersForm } from "./custom-letters-form";
import { KeychainConfig } from "@/types/product";

export function ProductDetailForm({ product, onPreviewChange }: ProductDetailFormProps) {
  const router = useRouter();
  // Check category instead of product_type for specific behaviors
  const isKeychains = product.category === "keychains";
  const isCustomLetters = product.product_type === "custom" && !isKeychains;
  
  // For standard products
  const [selectedFeature, setSelectedFeature] = useState(
    product.material_options[0] || "Standard"
  );
  const [quantity, setQuantity] = useState(1);
  
  // Type guard for custom config
  const customProductConfig = isCustomLetters && product.custom_config && 'defaultFont' in product.custom_config 
    ? product.custom_config 
    : null;

  // For custom letters
  const [customConfig, setCustomConfig] = useState<{
    text: string;
    characterCount: number;
    font: string;
    color: string;
    size: number; // Size in cm
    totalPrice: number;
  }>({
    text: "",
    characterCount: 0,
    font: customProductConfig?.defaultFont || product.material_options[0] || "",
    color: customProductConfig?.colors?.[0] || "black",
    size: 20, // Default 20cm
    totalPrice: 0,
  });

  const [isAdding, setIsAdding] = useState(false);

  const totalPrice = isCustomLetters 
    ? customConfig.totalPrice 
    : product.price * quantity;
  const isOutOfStock = product.stock_quantity === 0;
  const maxQuantity = Math.min(product.stock_quantity, 10); // Limit to 10 or stock quantity

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (newQuantity > maxQuantity) return maxQuantity;
      return newQuantity;
    });
  };

  const handleWhatsAppInquiry = () => {
    const keychainConfig = product.custom_config as KeychainConfig;
    const phoneNumber = keychainConfig?.whatsappNumber;
    
    if (!phoneNumber) {
      toast.error("WhatsApp number not configured for this product");
      return;
    }

    // Use custom message or default, replace {product_name} placeholder
    const messageTemplate = keychainConfig?.whatsappMessage || 
      `Hi! I'm interested in the {product_name}. Can you provide more details about customization options?`;
    
    const message = messageTemplate.replace(/{product_name}/g, product.name);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success("Opening WhatsApp...");
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
        quantity: isCustomLetters ? customConfig.characterCount : quantity,
        material: isCustomLetters 
          ? `${customConfig.font}|${customConfig.color}|${customConfig.size}|${customConfig.text}`
          : selectedFeature,
        customizations: isCustomLetters ? {
          text: customConfig.text,
          font: customConfig.font,
          color: customConfig.color,
          size: customConfig.size,
          characterCount: customConfig.characterCount,
          totalPrice: customConfig.totalPrice,
        } : undefined,
      });

      toast.success("Added to cart!");
      // Dispatch custom event to refresh cart count
      window.dispatchEvent(new CustomEvent("cart-updated"));
      router.push("/cart");
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 mb-8">
      {/* Product Name */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 lg:mb-4 text-accent-primary-dark">
          {product.name}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-2 sm:mb-3 lg:mb-4">
          {product.description}
        </p>
      </div>

      {/* Keychains - Show inquiry info only */}
      {isKeychains ? (
        <div className="space-y-4">
          <div className="p-4 sm:p-6 bg-accent-primary/10 rounded-lg border-2 border-accent-primary/30">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-accent-primary-dark">
              Custom Keychain Design
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Each keychain is custom-made to your specifications. Browse our portfolio above for inspiration, 
              then contact us to discuss your unique design ideas!
            </p>
            <ul className="space-y-2 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-accent-primary-dark">•</span>
                <span>Personalized designs tailored to your needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary-dark">•</span>
                <span>High-quality materials and craftsmanship</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-primary-dark">•</span>
                <span>Direct consultation with our design team</span>
              </li>
            </ul>
          </div>
          
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-base sm:text-base py-4 sm:py-5 lg:py-6 touch-manipulation"
            onClick={handleWhatsAppInquiry}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Inquire on WhatsApp
          </Button>
        </div>
      ) : (
        <>
          {/* Price Display */}
          <div>
            <p className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2">
              {totalPrice.toFixed(2)} RON
            </p>
            {isCustomLetters ? (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Price varies by size (5-24 cm)
                {customConfig.characterCount > 0 && (
                  <span className="ml-1">
                    • {customConfig.characterCount} {customConfig.characterCount === 1 ? "character" : "characters"}
                  </span>
                )}
              </p>
            ) : quantity > 1 && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {product.price.toFixed(2)} RON each
              </p>
            )}
          </div>

          {/* Custom Letters Form */}
          {isCustomLetters ? (
        <CustomLettersForm
          pricePerCharacter={product.price}
          availableFonts={product.material_options}
          customConfig={product.custom_config || {}}
          productName={product.name}
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
      ) : (
        <>
          {/* Feature Selection */}
          {product.material_options.length > 0 && (
            <div>
              <Label className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 block">
                Choose Features:
              </Label>
              <RadioGroup
                value={selectedFeature}
                onValueChange={setSelectedFeature}
                className="space-y-3"
              >
                {product.material_options.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-accent-primary/50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={feature} id={feature} className="h-4 w-4 flex-shrink-0" />
                    <Label
                      htmlFor={feature}
                      className="font-medium text-sm sm:text-base cursor-pointer flex-1"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 lg:mb-4 block">Quantity:</Label>
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
                  disabled={quantity >= maxQuantity || isOutOfStock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 sm:flex-none">
                {isOutOfStock ? (
                  <p className="text-xs sm:text-sm text-destructive font-medium">
                    Out of Stock
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {product.stock_quantity} available
                  </p>
                )}
              </div>
            </div>
          </div>
          </>
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full bg-accent-primary-dark hover:bg-accent-primary-dark/90 text-white text-base sm:text-base py-4 sm:py-5 lg:py-6 touch-manipulation"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding || (isCustomLetters && customConfig.characterCount === 0)}
          >
            {isAdding
              ? "Adding..."
              : isOutOfStock
              ? "Out of Stock"
              : isCustomLetters && customConfig.characterCount === 0
              ? "Enter Text to Continue"
              : "Add to Cart"}
          </Button>
        </>
      )}
    </div>
  );
}

