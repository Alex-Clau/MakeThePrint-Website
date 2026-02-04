import { Suspense } from "react";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface NewProductPageProps {
  searchParams: Promise<{ type?: string }>;
}

async function NewProductContent({ type }: { type?: string }) {
  const supabase = await createClient();

  // Check if user is authenticated and is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin/products/new");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/?error=unauthorized");
  }

  const productType = type || "seasonal";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-1">
          Create a new {productType === "custom" ? "custom" : "seasonal"} product
        </p>
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
