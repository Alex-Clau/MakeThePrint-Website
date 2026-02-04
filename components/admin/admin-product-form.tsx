"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminImageUpload } from "./admin-image-upload";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  images: string[];
  product_type: "custom" | "seasonal";
  category: string;
  featured: boolean;
  seasonal: boolean;
  stock_quantity: number;
  material_options: string[];
  custom_config?: {
    colors?: string[];
    fonts?: string[];
    defaultFont?: string;
    isOutdoor?: boolean;
    whatsappNumber?: string;
    whatsappMessage?: string;
  };
}

interface AdminProductFormProps {
  product?: any;
  initialType?: "custom" | "seasonal";
}

// Helper to get default config based on category
const getDefaultConfig = (category: string) => {
  if (category === "keychains") {
    return {
      whatsappNumber: "",
      whatsappMessage: "",
    };
  }
  // Wall letters config
  return {
    colors: ["black", "white", "beige", "brown"],
    fonts: ["Arial", "Roboto", "Playfair", "Montserrat", "Bebas Neue"],
    defaultFont: "Arial",
    isOutdoor: category === "outdoor_wall_letters",
  };
};

export function AdminProductForm({ product, initialType = "seasonal" }: AdminProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialCategory = product?.category || (initialType === "custom" ? "indoor_wall_letters" : "seasonal_decor");
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    images: product?.images || [],
    product_type: product?.product_type || initialType,
    category: initialCategory,
    featured: product?.featured || false,
    seasonal: product?.seasonal || (initialType === "seasonal"),
    stock_quantity: product?.stock_quantity || 0,
    material_options: product?.material_options || [],
    custom_config: product?.custom_config || getDefaultConfig(initialCategory),
  });

  // Derived state for checking category type
  const isKeychainCategory = formData.category === "keychains";
  const isWallLettersCategory = formData.category === "indoor_wall_letters" || formData.category === "outdoor_wall_letters";

  // Update config when category changes
  useEffect(() => {
    if (formData.product_type === "seasonal") {
      setFormData(prev => ({
        ...prev,
        category: "seasonal_decor",
        seasonal: true,
        custom_config: undefined,
      }));
    } else if (formData.product_type === "custom" && formData.category === "seasonal_decor") {
      setFormData(prev => ({
        ...prev,
        category: "indoor_wall_letters",
        seasonal: false,
        custom_config: getDefaultConfig("indoor_wall_letters"),
      }));
    }
  }, [formData.product_type]);

  // Update custom_config when category changes within custom products
  useEffect(() => {
    if (formData.product_type === "custom" && !product) {
      // Only reset config for new products when category changes
      setFormData(prev => ({
        ...prev,
        custom_config: getDefaultConfig(formData.category),
      }));
    }
  }, [formData.category, formData.product_type, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Product name is required");
        setIsSubmitting(false);
        return;
      }

      if (formData.price <= 0) {
        toast.error("Price must be greater than 0");
        setIsSubmitting(false);
        return;
      }

      if (formData.images.length === 0) {
        toast.error("At least one image is required");
        setIsSubmitting(false);
        return;
      }

      // Clean up custom_config based on category
      let cleanedConfig = formData.custom_config;
      if (formData.category === "keychains") {
        // Only keep keychain-specific fields
        cleanedConfig = {
          whatsappNumber: formData.custom_config?.whatsappNumber || "",
          whatsappMessage: formData.custom_config?.whatsappMessage || "",
        };
      } else if (formData.category === "indoor_wall_letters" || formData.category === "outdoor_wall_letters") {
        // Only keep wall letters fields
        cleanedConfig = {
          colors: formData.custom_config?.colors || [],
          fonts: formData.custom_config?.fonts || [],
          defaultFont: formData.custom_config?.defaultFont || "",
          isOutdoor: formData.category === "outdoor_wall_letters",
        };
      } else {
        // Seasonal products don't need custom_config
        cleanedConfig = undefined;
      }

      const productData = {
        ...formData,
        material_options: formData.material_options.length > 0 ? formData.material_options : ["standard"],
        custom_config: cleanedConfig,
      };

      if (product) {
        // Update existing product
        await updateProductAction(product.id, productData);
        toast.success("Product updated successfully");
      } else {
        // Create new product
        await createProductAction(productData);
        toast.success("Product created successfully");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  // Custom config handlers
  const handleColorAdd = (color: string) => {
    if (color && !formData.custom_config?.colors?.includes(color)) {
      setFormData({
        ...formData,
        custom_config: {
          ...formData.custom_config,
          colors: [...(formData.custom_config?.colors || []), color],
        },
      });
    }
  };

  const handleColorRemove = (color: string) => {
    setFormData({
      ...formData,
      custom_config: {
        ...formData.custom_config,
        colors: formData.custom_config?.colors?.filter(c => c !== color) || [],
      },
    });
  };

  const handleFontAdd = (font: string) => {
    if (font && !formData.custom_config?.fonts?.includes(font)) {
      setFormData({
        ...formData,
        custom_config: {
          ...formData.custom_config,
          fonts: [...(formData.custom_config?.fonts || []), font],
        },
      });
    }
  };

  const handleFontRemove = (font: string) => {
    setFormData({
      ...formData,
      custom_config: {
        ...formData.custom_config,
        fonts: formData.custom_config?.fonts?.filter(f => f !== font) || [],
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Back Button */}
      <Link href="/admin/products">
        <Button variant="ghost" type="button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Type */}
          <div className="space-y-2">
            <Label htmlFor="product_type">Product Type *</Label>
            <Select
              value={formData.product_type}
              onValueChange={(value: "custom" | "seasonal") =>
                setFormData({ ...formData, product_type: value })
              }
              disabled={!!product}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Product</SelectItem>
                <SelectItem value="seasonal">Seasonal Product</SelectItem>
              </SelectContent>
            </Select>
            {product && (
              <p className="text-xs text-muted-foreground">
                Product type cannot be changed after creation
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formData.product_type === "custom" ? (
                  <>
                    <SelectItem value="indoor_wall_letters">Indoor Wall Letters</SelectItem>
                    <SelectItem value="outdoor_wall_letters">Outdoor Wall Letters</SelectItem>
                    <SelectItem value="keychains">Keychains</SelectItem>
                  </>
                ) : (
                  <SelectItem value="seasonal_decor">Seasonal Decor</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Indoor Wall Letters - Premium Acrylic"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description..."
              rows={4}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              {isWallLettersCategory 
                ? "Base Price (RON) - Used for display only" 
                : isKeychainCategory
                ? "Contact for Pricing (displayed as info)"
                : "Price (RON) *"}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
            {isWallLettersCategory && (
              <p className="text-xs text-muted-foreground">
                For custom products, actual price is calculated based on character count and size
              </p>
            )}
            {isKeychainCategory && (
              <p className="text-xs text-muted-foreground">
                Keychains use WhatsApp inquiry - price is for reference only
              </p>
            )}
          </div>

          {/* Stock Quantity */}
          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              min="0"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, featured: checked as boolean })
              }
            />
            <Label htmlFor="featured" className="cursor-pointer">
              Feature this product on homepage
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images *</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminImageUpload
            images={formData.images}
            onChange={handleImagesChange}
          />
        </CardContent>
      </Card>

      {/* Custom Configuration (only for wall letters) */}
      {isWallLettersCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Available Colors */}
            <div className="space-y-2">
              <Label>Available Colors</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.custom_config?.colors?.map((color) => (
                  <div
                    key={color}
                    className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
                  >
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{color}</span>
                    <button
                      type="button"
                      onClick={() => handleColorRemove(color)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="new-color"
                  placeholder="Color name (e.g., black, #000000)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleColorAdd(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById("new-color") as HTMLInputElement;
                    handleColorAdd(input.value);
                    input.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Available Fonts */}
            <div className="space-y-2">
              <Label>Available Fonts</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.custom_config?.fonts?.map((font) => (
                  <div
                    key={font}
                    className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
                  >
                    <span className="text-sm">{font}</span>
                    <button
                      type="button"
                      onClick={() => handleFontRemove(font)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="new-font"
                  placeholder="Font name (e.g., Arial, Roboto)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleFontAdd(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById("new-font") as HTMLInputElement;
                    handleFontAdd(input.value);
                    input.value = "";
                  }}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Default Font */}
            <div className="space-y-2">
              <Label htmlFor="defaultFont">Default Font</Label>
              <Select
                value={formData.custom_config?.defaultFont}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    custom_config: {
                      ...formData.custom_config,
                      defaultFont: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formData.custom_config?.fonts?.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Is Outdoor */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOutdoor"
                checked={formData.custom_config?.isOutdoor || false}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    custom_config: {
                      ...formData.custom_config,
                      isOutdoor: checked as boolean,
                    },
                  })
                }
              />
              <Label htmlFor="isOutdoor" className="cursor-pointer">
                Outdoor product (affects pricing)
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keychain Configuration (only for keychains category) */}
      {isKeychainCategory && (
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Inquiry Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* WhatsApp Number */}
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
              <Input
                id="whatsappNumber"
                type="tel"
                value={formData.custom_config?.whatsappNumber || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_config: {
                      ...formData.custom_config,
                      whatsappNumber: e.target.value,
                    },
                  })
                }
                placeholder="e.g., 40712345678 (country code + number, no spaces)"
                required={isKeychainCategory}
              />
              <p className="text-xs text-muted-foreground">
                Enter phone number with country code (e.g., 40712345678 for Romania)
              </p>
            </div>

            {/* WhatsApp Message Template */}
            <div className="space-y-2">
              <Label htmlFor="whatsappMessage">Custom Message Template (Optional)</Label>
              <Textarea
                id="whatsappMessage"
                value={formData.custom_config?.whatsappMessage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    custom_config: {
                      ...formData.custom_config,
                      whatsappMessage: e.target.value,
                    },
                  })
                }
                placeholder="Hi! I'm interested in the {product_name}. Can you provide more details?"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use default message.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Save className="mr-2 h-5 w-5" />
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Link href="/admin/products">
          <Button type="button" variant="outline" size="lg">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
