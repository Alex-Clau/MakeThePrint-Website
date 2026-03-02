import { AdminProductForm } from "@/components/admin/admin-product-form";
import { messages } from "@/lib/messages";
import type { NewProductPageProps } from "@/types/admin";

async function NewProductContent({ type }: { type?: string }) {
  const productType = type;
  const t = messages.admin;
  const subtitle =
    productType === "custom"
      ? t.createNewCustomProduct
      : t.createNewSeasonalProduct;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t.addProduct}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>

      <AdminProductForm initialType={productType as "custom" | "seasonal"} />
    </div>
  );
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const { type } = await searchParams;
  return <NewProductContent type={type} />;
}
