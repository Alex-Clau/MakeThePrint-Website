"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductSearch } from "./product-search";

export function ProductsPageSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <ProductSearch
      onSearch={handleSearch}
      placeholder="Search products by name or description..."
    />
  );
}

