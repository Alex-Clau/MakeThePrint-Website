/**
 * Recent Orders component props
 */
export interface RecentOrdersProps {
  userId: string;
}

/**
 * Profile Form component props
 */
export interface ProfileFormProps {
  initialData: {
    email?: string;
    full_name?: string;
    phone?: string;
  };
  userId: string;
}

