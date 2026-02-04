"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";
import { deleteProductAction } from "@/app/admin/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  product_type: string;
  category: string;
  featured: boolean;
  seasonal: boolean;
  stock_quantity: number;
}

export function AdminProductsList({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [optimisticProducts, setOptimisticProducts] = useState(products);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    // Optimistic update
    setDeletingId(id);
    setOptimisticProducts(optimisticProducts.filter((p) => p.id !== id));

    try {
      await deleteProductAction(id);
      toast.success("Product deleted successfully");
      router.refresh();
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticProducts(products);
      toast.error("Failed to delete product");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (optimisticProducts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No products found</p>
          <Link href="/admin/products/new">
            <Button className="mt-4">Add Your First Product</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {optimisticProducts.map((product) => (
        <Card
          key={product.id}
          className={`overflow-hidden transition-all ${
            deletingId === product.id ? "opacity-50" : ""
          }`}
        >
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="relative w-full md:w-48 h-48 bg-muted flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <div className="flex gap-2">
                        {product.featured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                        <Badge
                          variant={
                            product.product_type === "custom"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {product.product_type === "custom"
                            ? "Custom"
                            : "Seasonal"}
                        </Badge>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-bold text-lg">
                        {product.price.toFixed(2)} RON
                      </span>
                      <span className="text-muted-foreground">
                        Stock: {product.stock_quantity}
                      </span>
                      <span className="text-muted-foreground">
                        {product.images?.length || 0} images
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <Link href={`/products/${product.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Eye className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </Link>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <Edit className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
