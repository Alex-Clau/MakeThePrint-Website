"use server";

import { revalidatePath } from "next/cache";

/** Revalidate routes that show product cards (incl. wishlist state after client mutations). */
export async function revalidateWishlistPaths() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/collections");
}
