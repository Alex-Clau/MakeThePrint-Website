"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "@/components/locale-provider";
import type { ProductFormData } from "./admin-product-form-types";

interface AdminProductBasicCardProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  product?: any;
  isPresetCategory: boolean;
  isInquireCategory: boolean;
}

export function AdminProductBasicCard({
  formData,
  setFormData,
  product,
  isPresetCategory,
  isInquireCategory,
}: AdminProductBasicCardProps) {
  const t = useTranslations().admin;

  return (
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
                  <SelectItem value="preset">Preset (configurable)</SelectItem>
                  <SelectItem value="inquire">Inquire (contact only)</SelectItem>
                  <SelectItem value="finished">Finished (sells as-is)</SelectItem>
                </>
              ) : (
                <SelectItem value="finished">Finished (sells as-is)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Name (English) */}
        <div className="space-y-2">
          <Label htmlFor="name">{t.productNameEn}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t.productNameEnPlaceholder}
            required
          />
        </div>

        {/* Name (Romanian) */}
        <div className="space-y-2">
          <Label htmlFor="name_ro">{t.productNameRo}</Label>
          <Input
            id="name_ro"
            value={formData.name_ro}
            onChange={(e) => setFormData({ ...formData, name_ro: e.target.value })}
            placeholder={t.productNameRoPlaceholder}
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
            {isPresetCategory
              ? "Base Price (RON) - Display only; actual price per size below"
              : isInquireCategory
              ? "Contact for Pricing (displayed as info)"
              : "Price (RON) *"}
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
          />
          {isPresetCategory && (
            <p className="text-xs text-muted-foreground">
              Preset: configure size and price per size below.
            </p>
          )}
          {isInquireCategory && (
            <p className="text-xs text-muted-foreground">
              Inquire: price is for reference only.
            </p>
          )}
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
  );
}
