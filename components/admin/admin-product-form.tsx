"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {AdminImageUpload} from "./admin-image-upload";
import {AdminProductBasicCard} from "./admin-product-basic-card";
import {AdminPresetConfigCard} from "./admin-preset-config-card";
import {AdminInquireConfigCard} from "./admin-inquire-config-card";
import {createProductAction, updateProductAction} from "@/app/(auth)/admin/actions";
import {toast} from "sonner";
import {ArrowLeft, Save} from "lucide-react";
import Link from "next/link";
import { messages } from "@/lib/messages";
import { type ProductFormData, getDefaultConfig } from "./admin-product-form-types";
import type { Product } from "@/types/product";
import {
  countValidSizePricePairs,
  getValidSizePriceEntries,
  presetCustomLettersEnabled,
} from "@/lib/utils/preset-letter-config";

interface AdminProductFormProps {
  product?: Product;
  initialType?: "custom" | "seasonal";
}

export function AdminProductForm({product, initialType = "custom"}: AdminProductFormProps) {
  const router = useRouter();
  const t = messages.admin;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialCategory = product?.category || (initialType === "custom" ? "preset" : "finished");

  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    images: product?.images || [],
    product_type: product?.product_type || initialType,
    category: initialCategory,
    featured: product?.featured || false,
    custom_config: product?.custom_config || getDefaultConfig(initialCategory),
  });

  const isPresetCategory = formData.category === "preset";
  const isInquireCategory = formData.category === "inquire";

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
        const presetConfig =
          formData.custom_config && "colors" in formData.custom_config
            ? formData.custom_config
            : undefined;
        const lettersOn = presetCustomLettersEnabled(presetConfig);

        if (lettersOn && countValidSizePricePairs(presetConfig) < 1) {
          toast.error(t.presetLettersRequireValidSizePrice);
          setIsSubmitting(false);
          return;
        }

        const validSizePrices = lettersOn ? getValidSizePriceEntries(presetConfig?.sizePrices) : [];

        cleanedConfig = {
          customLettersEnabled: lettersOn,
          colors: lettersOn ? presetConfig?.colors || [] : [],
          fonts: lettersOn ? presetConfig?.fonts || [] : [],
          defaultFont: lettersOn ? presetConfig?.defaultFont || "" : "",
          sizePrices: lettersOn ? validSizePrices : [],
          isOutdoor: presetConfig?.isOutdoor ?? false,
          isLedStrip: presetConfig?.isLedStrip ?? false,
          isColor: presetConfig?.isColor ?? false,
          outdoorPrice: presetConfig?.outdoorPrice ?? 0,
          ledStripPrice: presetConfig?.ledStripPrice ?? 0,
          colorPrice: presetConfig?.colorPrice ?? 0,
          pricePerCharacter: lettersOn ? presetConfig?.pricePerCharacter ?? 0 : 0,
        };
      } else if (formData.category === "inquire") {
        const inquireConfig = formData.custom_config && "whatsappNumber" in formData.custom_config ? formData.custom_config : undefined;
        cleanedConfig = {
          whatsappNumber: inquireConfig?.whatsappNumber || "",
          whatsappMessage: inquireConfig?.whatsappMessage || "",
        };
      } else {
        cleanedConfig = undefined;
      }

      const productData = {
        ...formData,
        custom_config: cleanedConfig,
      };

      const goToCatalog = () => {
        router.push("/admin/products");
        router.refresh();
      };

      if (product) {
        const result = await updateProductAction(product.id, productData);
        if (result.success) {
          toast.success(result.message);
          queueMicrotask(goToCatalog);
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await createProductAction(productData);
        if (result.success) {
          toast.success(result.message);
          queueMicrotask(goToCatalog);
        } else {
          toast.error(result.message);
        }
      }
    } catch {
      toast.error(t.adminActionFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setFormData({...formData, images});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Link href="/admin/products">
        <Button
          variant="ghost"
          type="button"
        >
          <ArrowLeft className="mr-2 h-4 w-4"/>
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
        <AdminPresetConfigCard
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {isInquireCategory && (
        <AdminInquireConfigCard
          formData={formData}
          setFormData={setFormData}
        />
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-5 w-5"/>
          {isSubmitting ? t.saving : product ? t.updateProduct : t.createProduct}
        </Button>
        <Link href="/admin/products">
          <Button
            type="button"
            variant="outline"
            size="lg"
          >
            {t.cancel}
          </Button>
        </Link>
      </div>
    </form>
  );
}
