import { Suspense } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { notFound, redirect } from "next/navigation";
import { getDictionary, getLocaleFromCookie } from "@/lib/i18n";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

async function EditProductContent({ productId }: { productId: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin/products");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/?error=unauthorized");
  }

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error || !product) {
    notFound();
  }

  const locale = getLocaleFromCookie((await cookies()).get("locale")?.value);
  const a = getDictionary(locale).admin;

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

async function EditProductWrapper({ params }: EditProductPageProps) {
  const { id } = await params;
  return <EditProductContent productId={id} />;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <div className="h-9 w-48 bg-muted animate-pulse rounded" />
            <div className="h-5 w-32 bg-muted animate-pulse rounded mt-1" />
          </div>
          <div className="h-[600px] bg-muted animate-pulse rounded-lg" />
        </div>
      }
    >
      <EditProductWrapper params={params} />
    </Suspense>
  );
}
