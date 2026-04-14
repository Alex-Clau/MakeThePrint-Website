"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { messages } from "@/lib/messages";
import type { ProductFormData } from "./admin-product-form-types";
import type { Product } from "@/types/product";

interface AdminProductBasicCardProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  product?: Product;
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
  const t = messages.admin;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.basicInformation}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Type */}
        <div className="space-y-2">
          <Label htmlFor="product_type">{t.productTypeLabel}</Label>
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
              <SelectItem value="custom">{t.customProductOption}</SelectItem>
              <SelectItem value="seasonal">{t.seasonalProductOption}</SelectItem>
            </SelectContent>
          </Select>
          {product && (
            <p className="text-xs text-muted-foreground">
              {t.productTypeCannotChange}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t.categoryLabel}</Label>
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
                  <SelectItem value="preset">{t.presetOption}</SelectItem>
                  <SelectItem value="inquire">{t.inquireOption}</SelectItem>
                  <SelectItem value="finished">{t.finishedOption}</SelectItem>
                </>
              ) : (
                <SelectItem value="finished">{t.finishedOption}</SelectItem>
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

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t.descriptionLabel}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={t.descriptionPlaceholder}
            rows={4}
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">
            {isPresetCategory
              ? t.basePricePresetLabel
              : isInquireCategory
              ? t.contactForPricingLabel
              : t.priceRonRequired}
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
              {t.presetConfigureBelow}
            </p>
          )}
          {isInquireCategory && (
            <p className="text-xs text-muted-foreground">
              {t.inquirePriceReference}
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
            {t.featureOnHomepage}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
