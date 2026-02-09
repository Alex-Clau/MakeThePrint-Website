import { CustomProductConfig } from "./product";

/**
 * Custom Letters Form component props
 * Sizes and prices come from product customConfig.sizePrices (admin-defined).
 */
export interface CustomLettersFormProps {
  availableFonts: string[];
  customConfig: CustomProductConfig;
  text: string; // Text input (controlled by parent; can be typed in form or in preview)
  onTextChange?: (text: string) => void; // Called when user types so parent can update preview and price recalculates
  onConfigChange: (config: {
    text: string;
    characterCount: number;
    font: string;
    color: string;
    size: string; // Admin-defined size label (e.g. "10cm")
    totalPrice: number;
    isOutdoor?: boolean;
    isLedStrip?: boolean;
    isColor?: boolean;
  }) => void;
}

/**
 * Product Image Gallery component props
 */
export interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  defaultImage?: string;
}

/**
 * Product Reviews component props
 */
export interface ProductReviewsProps {
  productId: string;
  userId?: string;
}

/**
 * Review interface
 */
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at?: string;
  user_profiles?: {
    full_name?: string;
    email?: string;
  };
  user_id: string;
}

/**
 * Product Reviews List component props
 */
export interface ProductReviewsListProps {
  reviews: Review[];
  currentUserId?: string;
  averageRating: number;
  totalReviews: number;
  productId: string;
}

/**
 * Create Review Form component props
 */
export interface CreateReviewFormProps {
  productId: string;
  userId: string;
  reviews: any[];
  onClose?: () => void;
}


/**
 * Product Card Actions component props
 */
export interface ProductCardActionsProps {
  productId: string;
  isInWishlist?: boolean;
  showWishlistOnly?: boolean;
  showCartOnly?: boolean;
}

/**
 * Text Preview component props
 */
export interface TextPreviewProps {
  text: string;
  font: string;
  color: string;
  size: string; // Admin-defined size label (e.g. "10cm")
  maxLength?: number; // Maximum characters allowed
  onTextChange?: (text: string) => void;
}

