"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminImageUpload } from "./admin-image-upload";
import { AdminProductBasicCard } from "./admin-product-basic-card";
import { AdminPresetConfigCard } from "./admin-preset-config-card";
import { AdminInquireConfigCard } from "./admin-inquire-config-card";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "@/components/locale-provider";
import { type ProductFormData, getDefaultConfig } from "./admin-product-form-types";

interface AdminProductFormProps {
  product?: any;
  initialType?: "custom" | "seasonal";
}

export function AdminProductForm({ product, initialType = "seasonal" }: AdminProductFormProps) {
  const router = useRouter();
  const t = useTranslations().admin;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialCategory = product?.category || (initialType === "custom" ? "preset" : "finished");

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    name_ro: product?.name_ro ?? "",
    description: product?.description || "",
    price: product?.price || 0,
    images: product?.images || [],
    product_type: product?.product_type || initialType,
    category: initialCategory,
    featured: product?.featured || false,
    seasonal: product?.seasonal || (initialType === "seasonal"),
    material_options: product?.material_options || [],
    custom_config: product?.custom_config || getDefaultConfig(initialCategory),
  });

  const isPresetCategory = formData.category === "preset";
  const isInquireCategory = formData.category === "inquire";

  useEffect(() => {
    if (formData.product_type === "seasonal") {
      setFormData((prev) => ({
        ...prev,
        category: "finished",
        seasonal: true,
        custom_config: undefined,
      }));
    } else if (formData.product_type === "custom" && formData.category === "finished") {
      setFormData((prev) => ({
        ...prev,
        category: "preset",
        seasonal: false,
        custom_config: getDefaultConfig("preset"),
      }));
    }
  }, [formData.product_type]);

  useEffect(() => {
    if (formData.product_type === "custom" && !product) {
      setFormData((prev) => ({
        ...prev,
        custom_config: getDefaultConfig(formData.category),
      }));
    }
  }, [formData.category, formData.product_type, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name.trim()) {
        toast.error(t.productNameRequired);
        setIsSubmitting(false);
        return;
      }

      if (formData.price <= 0) {
        toast.error(t.priceMustBePositive);
        setIsSubmitting(false);
        return;
      }

      if (formData.images.length === 0) {
        toast.error(t.atLeastOneImage);
        setIsSubmitting(false);
        return;
      }

      let cleanedConfig = formData.custom_config;
      if (formData.category === "preset") {
        cleanedConfig = {
          colors: formData.custom_config?.colors || [],
          fonts: formData.custom_config?.fonts || [],
          defaultFont: formData.custom_config?.defaultFont || "",
          sizePrices: formData.custom_config?.sizePrices || [],
          isOutdoor: formData.custom_config?.isOutdoor ?? false,
          isLedStrip: formData.custom_config?.isLedStrip ?? false,
          isColor: formData.custom_config?.isColor ?? false,
          outdoorPrice: formData.custom_config?.outdoorPrice ?? 0,
          ledStripPrice: formData.custom_config?.ledStripPrice ?? 0,
          colorPrice: formData.custom_config?.colorPrice ?? 0,
          pricePerCharacter: formData.custom_config?.pricePerCharacter ?? 0,
        };
      } else if (formData.category === "inquire") {
        cleanedConfig = {
          whatsappNumber: formData.custom_config?.whatsappNumber || "",
          whatsappMessage: formData.custom_config?.whatsappMessage || "",
        };
      } else {
        cleanedConfig = undefined;
      }

      const productData = {
        ...formData,
        material_options: formData.material_options.length > 0 ? formData.material_options : ["standard"],
        custom_config: cleanedConfig,
      };

      if (product) {
        await updateProductAction(product.id, productData);
        toast.success(t.productUpdated);
      } else {
        await createProductAction(productData);
        toast.success(t.productCreated);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error instanceof Error ? error.message : t.saveFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({ ...formData, images });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Link href="/admin/products">
        <Button variant="ghost" type="button">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.back}
        </Button>
      </Link>

      <AdminProductBasicCard
        formData={formData}
        setFormData={setFormData}
        product={product}
        isPresetCategory={isPresetCategory}
        isInquireCategory={isInquireCategory}
      />

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

      {isPresetCategory && (
        <AdminPresetConfigCard formData={formData} setFormData={setFormData} />
      )}

      {isInquireCategory && (
        <AdminInquireConfigCard formData={formData} setFormData={setFormData} />
      )}

      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          <Save className="mr-2 h-5 w-5" />
          {isSubmitting ? t.saving : product ? t.updateProduct : t.createProduct}
        </Button>
        <Link href="/admin/products">
          <Button type="button" variant="outline" size="lg">
            {t.cancel}
          </Button>
        </Link>
      </div>
    </form>
  );
}
