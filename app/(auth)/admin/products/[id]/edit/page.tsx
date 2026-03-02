import { getProductById } from "@/lib/supabase/products";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { notFound } from "next/navigation";
import { messages } from "@/lib/messages";
import type { EditProductPageProps } from "@/types/admin";

async function EditProductContent({ productId }: { productId: string }) {
  let product;
  try {
    product = await getProductById(productId);
  } catch {
    notFound();
  }

  const a = messages.admin;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{a.editProduct}</h1>
        <p className="text-muted-foreground mt-1">
          {a.updateProductName.replace("{name}", product.name)}
        </p>
      </div>

      <AdminProductForm product={product} />
    </div>
  );
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <EditProductContent productId={id} />;
}
