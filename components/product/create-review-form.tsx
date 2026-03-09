"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createReviewClient, updateReviewClient, deleteReviewClient } from "@/lib/supabase/reviews-client";
import { updateUserProfileClient } from "@/lib/supabase/user-profiles-client";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { useRouter } from "next/navigation";
import { CreateReviewFormProps } from "@/types/product-components";
import { messages } from "@/lib/messages";
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

export function CreateReviewForm({
  productId,
  userId,
  userReview,
  userDisplayName,
  onClose,
}: CreateReviewFormProps) {
  const router = useRouter();
  const t = messages.reviews;
  const a = messages.account;
  const existingReview = userReview ?? undefined;
  const showDisplayNameField = !existingReview && !userDisplayName;
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        if (showDisplayNameField && displayName.trim()) {
          await updateUserProfileClient(userId, { full_name: displayName.trim() });
        }
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
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error));
      if ((error as Error & { code?: string })?.code === "UNAUTHORIZED") {
        router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!existingReview) return;

    setShowDeleteDialog(false);
    setIsSubmitting(true);
    try {
      await deleteReviewClient(existingReview.id, userId);
      toast.success(t.reviewDeleted);
      if (onClose) onClose();
      router.refresh();
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error));
      if ((error as Error & { code?: string })?.code === "UNAUTHORIZED") {
        router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      }
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
          {showDisplayNameField && (
            <div>
              <Label htmlFor="displayName">{a.displayNameLabel}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                placeholder={a.displayNamePlaceholder}
                className="mt-2"
              />
            </div>
          )}
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
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isSubmitting}
                >
                  {t.deleteReview}
                </Button>
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.confirmDeleteReview}</AlertDialogTitle>
                      <AlertDialogDescription>
                        Această acțiune nu poate fi anulată.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{messages.common.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {t.deleteReview}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

