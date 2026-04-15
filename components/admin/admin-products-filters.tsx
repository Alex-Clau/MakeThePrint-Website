"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CatalogSearchBar } from "@/components/shared/catalog-search-bar";
import { messages } from "@/lib/messages";

type TypeFilter = "all" | "custom" | "seasonal";
type CategoryFilter = "all" | "preset" | "inquire" | "finished";

export function AdminProductsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const a = messages.admin;
  const c = messages.common;

  const typeParam = searchParams.get("type");
  const categoryParam = searchParams.get("category");

  const type: TypeFilter =
    typeParam === "custom" || typeParam === "seasonal" ? typeParam : "all";
  const category: CategoryFilter =
    categoryParam === "preset" ||
    categoryParam === "inquire" ||
    categoryParam === "finished"
      ? categoryParam
      : "all";

  const buildHref = useCallback((nextType: TypeFilter, nextCategory: CategoryFilter) => {
    const p = new URLSearchParams();
    if (nextType !== "all") p.set("type", nextType);
    if (nextCategory !== "all") p.set("category", nextCategory);
    const search = searchParams.get("search");
    if (search) p.set("search", search);
    const q = p.toString();
    return q ? `/admin/products?${q}` : "/admin/products";
  }, [searchParams]);

  const apply = useCallback(
    (nextType: TypeFilter, nextCategory: CategoryFilter) => {
      router.push(buildHref(nextType, nextCategory));
    },
    [buildHref, router]
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-muted/20 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <p className="text-sm font-medium text-foreground sm:hidden">{a.filterProductsTitle}</p>
      <div className="flex min-w-0 flex-1 flex-col gap-4 order-2 sm:order-1 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="space-y-2 min-w-[200px] sm:min-w-[220px]">
          <Label className="text-xs text-muted-foreground">{a.filterTypeTitle}</Label>
          <Select
            value={type}
            onValueChange={(v) => apply(v as TypeFilter, category)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{a.filterTypeAll}</SelectItem>
              <SelectItem value="custom">{a.filterTypeCustom}</SelectItem>
              <SelectItem value="seasonal">{a.filterTypeSeasonal}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 min-w-[200px] sm:min-w-[220px]">
          <Label className="text-xs text-muted-foreground">{a.filterCategoryTitle}</Label>
          <Select
            value={category}
            onValueChange={(v) => apply(type, v as CategoryFilter)}
          >
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{a.filterCategoryAll}</SelectItem>
              <SelectItem value="preset">{a.filterCategoryPreset}</SelectItem>
              <SelectItem value="inquire">{a.filterCategoryInquire}</SelectItem>
              <SelectItem value="finished">{a.filterCategoryFinished}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full order-1 sm:order-2 sm:ml-4 sm:w-auto sm:max-w-xl sm:shrink-0">
        <CatalogSearchBar
          placeholder={c.searchProductPlaceholder}
          clearLabel={c.clearSearch}
          loadingLabel={c.loading}
          className="w-full"
        />
      </div>
    </div>
  );
}
