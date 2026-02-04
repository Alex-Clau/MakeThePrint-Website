import { CustomProductConfig } from "./product";

/**
 * Custom Letters Form component props
 */
export interface CustomLettersFormProps {
  pricePerCharacter: number;
  availableFonts: string[];
  customConfig: CustomProductConfig;
  productName?: string; // Used to determine if indoor or outdoor
  text: string; // Text input comes from the preview box
  onConfigChange: (config: {
    text: string;
    characterCount: number;
    font: string;
    color: string;
    size: number; // Size in cm
    totalPrice: number;
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
  size: number; // Size in cm
  onTextChange?: (text: string) => void;
}

