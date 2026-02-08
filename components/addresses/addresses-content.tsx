"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  addShippingAddressClient,
  updateUserProfileClient,
} from "@/lib/supabase/user-profiles-client";
import { AddressForm } from "./address-form";
import { AddressList } from "./address-list";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { AddressesContentProps } from "@/types/address-components";
import { useTranslations } from "@/components/locale-provider";

export function AddressesContent({
  addresses: initialAddresses,
  userId,
}: AddressesContentProps) {
  const router = useRouter();
  const t = useTranslations().account;
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSave = async (addressData: any) => {
    try {
      if (editingIndex !== null) {
        const updated = [...addresses];
        updated[editingIndex] = addressData;
        await updateUserProfileClient(userId, {
          shipping_addresses: updated,
        });
        setAddresses(updated);
        setEditingIndex(null);
      } else {
        await addShippingAddressClient(userId, addressData);
        setAddresses([...addresses, addressData]);
      }
      setShowForm(false);
      toast.success(editingIndex !== null ? t.addressUpdated : t.addressAdded);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message || t.saveAddressFailed);
    }
  };

  const handleEdit = (index: number, address: any) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    try {
      const updated = addresses.filter((_, i) => i !== index);
      await updateUserProfileClient(userId, {
        shipping_addresses: updated,
      });
      setAddresses(updated);
      toast.success(t.addressDeleted);
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t.shippingAddresses}</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="h-10 sm:h-10 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {t.addAddress}
          </Button>
        )}
      </div>

      {showForm && (
        <AddressForm
          onSave={handleSave}
          initialData={editingIndex !== null ? addresses[editingIndex] : undefined}
          onCancel={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
        />
      )}

      {!showForm && (
        <AddressList
          addresses={addresses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

