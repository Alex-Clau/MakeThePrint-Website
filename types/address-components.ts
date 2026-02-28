import { AddressFormData } from "./address";

/**
 * Address interface (optional fields, e.g. for list display).
 * Use Partial<AddressFormData> for a single source of truth.
 */
export type Address = Partial<AddressFormData>;

/**
 * Database Address interface
 */
export interface DatabaseAddress {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Address Fields component props
 */
export interface AddressFieldsProps {
  formData: AddressFormData;
  onChange: (data: AddressFormData) => void;
}

/**
 * Address Form component props
 */
export interface AddressFormProps {
  onSave: (address: AddressFormData) => void;
  initialData?: Partial<AddressFormData>;
  onCancel?: () => void;
}

/**
 * Address List component props
 */
export interface AddressListProps {
  addresses: Address[];
  onEdit: (index: number, address: Address) => void;
  onDelete: (index: number) => void;
}

/**
 * Addresses Content component props
 */
export interface AddressesContentProps {
  addresses: any[];
  userId: string;
}

