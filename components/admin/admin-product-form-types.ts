import type {
  SizePriceEntry,
  CustomProductConfig,
  KeychainConfig,
} from "@/types/product";
import { PRESET_COLORS, PRESET_FONTS } from "@/lib/constants/preset-options";

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  images: string[];
  product_type: "custom" | "seasonal";
  category: string;
  featured: boolean;
  seasonal: boolean;
  custom_config?: CustomProductConfig | KeychainConfig;
}

export function getDefaultConfig(category: string): ProductFormData["custom_config"] {
  if (category === "inquire") {
    return { whatsappNumber: "", whatsappMessage: "" };
  }
  if (category === "preset") {
    return {
      colors: [...PRESET_COLORS],
      fonts: [...PRESET_FONTS],
      defaultFont: PRESET_FONTS[0] ?? "Arial",
      sizePrices: [],
      isOutdoor: false,
      isLedStrip: false,
      isColor: false,
      pricePerCharacter: 0,
    };
  }
  return undefined;
}
