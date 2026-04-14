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
  /** Large preview editor on the form; when set, omit onTextChange to avoid a second text field. */
  onLetterTextChange?: (text: string) => void;
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
 * Wall letter live preview (read-only or editable when onTextChange is set).
 */
export interface TextPreviewProps {
  text: string;
  font: string;
  color: string;
  size: string;
  maxLength?: number;
  onTextChange?: (text: string) => void;
  /** Tighter padding when nested in the product form under instructions. */
  padding?: "default" | "compact";
  /** Associates an external `<Label htmlFor>`. */
  inputId?: string;
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
  initialReviews: Review[];
  currentUserId?: string;
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
  productId: string;
  initialHasMore: boolean;
  userReview?: Review | null;
  userDisplayName?: string;
}

/**
 * Create Review Form component props
 */
export interface CreateReviewFormProps {
  productId: string;
  userId: string;
  userReview?: Review | null;
  userDisplayName?: string;
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

