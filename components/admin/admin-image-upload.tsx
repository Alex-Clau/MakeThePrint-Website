"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { messages } from "@/lib/messages";
import { PRODUCT_IMAGE_UPLOAD_MAX_BYTES } from "@/lib/constants/product-image-upload";

interface AdminImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function AdminImageUpload({
  images,
  onChange,
  maxImages = 10,
}: AdminImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Upload image bytes via authenticated admin API; returns public URL. */
  const uploadProductImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    const filename = file.name || "image";

    formData.append("file", file, filename);
    formData.append("filename", filename);

    const res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      let message = messages.admin.uploadFailedGeneric;
      try {
        const data = await res.json();
        if (data?.error) {
          message = data.error;
        }
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(message);
    }

    const data = await res.json();
    if (!data?.url || typeof data.url !== "string") {
      throw new Error("Upload did not return a URL");
    }

    return data.url;
  }, []);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(messages.admin.maxImagesAllowed.replace("{max}", String(maxImages)));
      return;
    }

    setUploading(true);

    try {
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(messages.admin.notAnImage.replace("{name}", file.name));
          continue;
        }

        if (file.size > PRODUCT_IMAGE_UPLOAD_MAX_BYTES) {
          toast.error(messages.admin.tooLarge.replace("{name}", file.name));
          continue;
        }

        try {
          const url = await uploadProductImage(file);
          newImages.push(url);
        } catch (error: unknown) {
          toast.error(getUserFriendlyError(error) || messages.admin.failedToProcess.replace("{name}", file.name));
        }
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
        toast.success(messages.admin.addedImages.replace("{count}", String(newImages.length)));
      }
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error) || messages.admin.failedToUploadImages);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [images, maxImages, onChange, uploadProductImage]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        void handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast.success(messages.admin.imageRemoved);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive
            ? "border-accent-primary bg-accent-primary/10"
            : "border-muted-foreground/25"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            {messages.admin.dragDropImages}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {uploading ? messages.checkout.processing : messages.admin.selectImages}
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            {messages.admin.maxImagesCompressed.replace("{max}", String(maxImages))}
            <br />
            {messages.admin.imagesUploadedCount.replace("{current}", String(images.length)).replace("{max}", String(maxImages))}
          </p>
        </div>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-accent-primary text-white text-xs px-2 py-1 rounded">
                    {messages.admin.main}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReorder(index, 0)}
                    >
                      {messages.admin.makeMain}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {messages.admin.firstImageMainHint}
        </p>
      )}
    </div>
  );
}
