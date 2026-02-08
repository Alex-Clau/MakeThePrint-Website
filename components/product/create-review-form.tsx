"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReviewClient, updateReviewClient, deleteReviewClient } from "@/lib/supabase/reviews-client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { useRouter } from "next/navigation";
import { CreateReviewFormProps } from "@/types/product-components";
import { useTranslations } from "@/components/locale-provider";

export function CreateReviewForm({
  productId,
  userId,
  reviews,
  onClose,
}: CreateReviewFormProps) {
  const router = useRouter();
  const t = useTranslations().reviews;
  const existingReview = reviews.find((r) => r.user_id === userId);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t.pleaseSelectRating);
      return;
    }

    setIsSubmitting(true);
    try {
      if (existingReview) {
        await updateReviewClient(existingReview.id, userId, {
          rating,
          comment: comment || undefined,
        }, productId);
        toast.success(t.reviewUpdated);
      } else {
        await createReviewClient({
          user_id: userId,
          product_id: productId,
          rating,
          comment: comment || undefined,
        });
        toast.success(t.reviewSubmitted);
      }
      if (onClose) onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    if (!confirm(t.confirmDeleteReview)) return;

    setIsSubmitting(true);
    try {
      await deleteReviewClient(existingReview.id, userId);
      toast.success(t.reviewDeleted);
      if (onClose) onClose();
      router.refresh();
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingReview ? t.updateYourReview : t.writeReview}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t.rating}</Label>
            <div className="flex items-center gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-muted-foreground hover:text-yellow-300"
                  }`}
                >
                  ★
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-muted-foreground ml-2">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="comment">{t.commentOptional}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t.shareExperience}
              className="mt-2"
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t.submitting
                : existingReview
                ? t.updateReview
                : t.submitReview}
            </Button>
            {existingReview && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {t.deleteReview}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

