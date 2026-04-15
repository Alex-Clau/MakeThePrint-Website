"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { deleteProductAction } from "@/app/(auth)/admin/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { messages } from "@/lib/messages";
import type { Product } from "@/types/product";
import { getApiErrorBody } from "@/lib/utils/api-error";
import { useInfiniteScrollList } from "@/lib/hooks/use-infinite-scroll-list";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type AdminProductsListProps = {
  initialProducts: Product[];
  initialPage: number;
  pageSize: number;
  initialHasMore: boolean;
  type?: string;
  category?: string;
  search?: string;
};

type AdminProductsApiResponse = {
  products: Product[];
  hasMore: boolean;
  page: number;
  pageSize: number;
};

export function AdminProductsList({
  initialProducts,
  initialPage,
  pageSize,
  initialHasMore,
  type,
  category,
  search,
}: AdminProductsListProps) {
  const router = useRouter();
  const t = messages.admin;
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const loadPage = useCallback(
    async (page: number) => {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
      });
      if (type) params.set("type", type);
      if (category) params.set("category", category);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      if (!res.ok) {
        const { message } = await getApiErrorBody(res);
        throw new Error(message);
      }
      const body = (await res.json()) as AdminProductsApiResponse;
      return { items: body.products, hasMore: body.hasMore };
    },
    [category, pageSize, search, type]
  );

  const { items: products, setItems: setProducts, hasMore, isLoading, error, sentinelRef } =
    useInfiniteScrollList<Product>({
      initialItems: initialProducts,
      initialPage,
      initialHasMore,
      resetKey: `${type ?? "all"}|${category ?? "all"}|${search ?? ""}`,
      loadPage,
      defaultError: t.catalogLoadMoreFailed,
    });

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const snapshot = [...products];
    setDeletingId(deleteTarget.id);
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    const target = deleteTarget;
    setDeleteTarget(null);

    try {
      const result = await deleteProductAction(target.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        setProducts(snapshot);
        toast.error(result.message);
      }
    } catch {
      setProducts(snapshot);
      toast.error(t.adminActionFailed);
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t.noProductsFound}</p>
          <Link href="/admin/products/new">
            <Button className="mt-4">{t.addYourFirstProduct}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const imageCount = product.images?.length ?? 0;
        const imageCountLabel = (imageCount === 1 ? t.productImageCountOne : t.productImageCountOther).replace(
          "{count}",
          String(imageCount)
        );
        return (
        <Card
          key={product.id}
          className={`overflow-hidden transition-all ${
            deletingId === product.id ? "opacity-50" : ""
          }`}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative h-48 w-full flex-shrink-0 bg-muted md:w-48">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 767px) 100vw, 192px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    {t.noImage}
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="min-w-0 flex-1 space-y-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-lg font-bold">
                        {product.price.toFixed(2)} RON
                      </span>
                      <span className="text-muted-foreground">{imageCountLabel}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:flex-col">
                    <Link href={`/products/${product.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t.view}</span>
                      </Button>
                    </Link>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">{t.edit}</span>
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{t.delete}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        );
      })}

      <div ref={sentinelRef} className="h-10" />
      {isLoading && (
        <p className="mt-2 text-center text-sm text-muted-foreground">{t.catalogLoadingMore}</p>
      )}
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
      {!hasMore && products.length > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">{t.catalogEndOfList}</p>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDeleteTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? t.confirmDelete.replace("{name}", deleteTarget.name)
                : ""}{" "}
              {t.confirmDeleteIrreversible}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
