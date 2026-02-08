"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { ProductListItem } from "@/components/product/product-list-item";
import { ViewToggle } from "@/components/product/view-toggle";
import { ProductsContentProps } from "@/types/components";
import {usePathname} from "next/navigation";

export function ProductsContent({ products }: ProductsContentProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const pathName = usePathname();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Showing {products.length} products
        </p>
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={`${product.id}-${pathName}-${viewMode}`} {...product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}

