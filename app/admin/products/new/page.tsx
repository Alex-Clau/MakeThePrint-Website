import { Suspense } from "react";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { messages } from "@/lib/messages";

interface NewProductPageProps {
  searchParams: Promise<{ type?: string }>;
}

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

async function NewProductWrapper({ searchParams }: NewProductPageProps) {
  const { type } = await searchParams;
  return <NewProductContent type={type} />;
}

export default function NewProductPage({ searchParams }: NewProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <div className="h-9 w-48 bg-muted animate-pulse rounded" />
            <div className="h-5 w-64 bg-muted animate-pulse rounded mt-1" />
          </div>
          <div className="h-[600px] bg-muted animate-pulse rounded-lg" />
        </div>
      }
    >
      <NewProductWrapper searchParams={searchParams} />
    </Suspense>
  );
}
