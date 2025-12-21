"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Package, Clock, Ruler } from "lucide-react";
import { useState } from "react";
import { ProductDetailFormProps } from "@/types/components";

export function ProductDetailForm({ product }: ProductDetailFormProps) {
  const [selectedMaterial, setSelectedMaterial] = useState(
    product.material_options[0] || "PLA"
  );
  const [quantity, setQuantity] = useState(1);

  const totalPrice = product.price * quantity;
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

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Add to cart:", {
      product_id: product.id,
      quantity,
      material: selectedMaterial,
      price: totalPrice,
    });
    // TODO: Call Supabase to add to cart
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Product Name */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-900 dark:text-blue-700 mb-2 sm:mb-3 lg:mb-4">
          {product.name}
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 lg:mb-4">
          {product.description}
        </p>
        {product.rating && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-muted-foreground">
              ({product.review_count || 0} reviews)
            </span>
          </div>
        )}
      </div>

      {/* Price Display */}
      <div>
        <p className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-700 mb-1 sm:mb-2">
          ${totalPrice.toFixed(2)}
        </p>
        {quantity > 1 && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            ${product.price.toFixed(2)} each
          </p>
        )}
      </div>

      {/* Material Selection */}
      <div>
        <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 lg:mb-4 block">
          Material:
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {product.material_options.map((material) => (
            <button
              key={material}
              onClick={() => setSelectedMaterial(material)}
              className={`border-2 rounded-lg p-2.5 sm:p-3 lg:p-4 text-center font-medium text-sm sm:text-base transition-all ${
                selectedMaterial === material
                  ? "border-blue-700 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-700"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              {material}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <Label className="text-sm sm:text-base font-semibold mb-2 sm:mb-3 lg:mb-4 block">Quantity:</Label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-auto">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 sm:h-12 sm:w-12"
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
              className="h-10 w-10 sm:h-12 sm:w-12"
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

      {/* Product Specs */}
      {(product.dimensions ||
        product.print_time_hours ||
        product.weight_grams) && (
        <div className="space-y-2 pt-4 border-t">
          {product.dimensions && (
            <div className="flex items-center gap-2 text-sm">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="font-medium">{product.dimensions}</span>
            </div>
          )}
          {product.print_time_hours && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Print Time:</span>
              <span className="font-medium">
                {product.print_time_hours} hours
              </span>
            </div>
          )}
          {product.weight_grams && (
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Weight:</span>
              <span className="font-medium">
                {product.weight_grams}g
              </span>
            </div>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white text-base sm:text-lg py-4 sm:py-5 lg:py-6"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}

