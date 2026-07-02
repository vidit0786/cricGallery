"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Replace, Trash2, X } from "lucide-react";

import { ImageCard } from "@/components/studio/image-card";
import { PreviewPanel } from "@/components/studio/preview-panel";
import { UploadCard } from "@/components/studio/upload-card";
import { Button } from "@/components/ui/button";
import {
  formatFileSize,
  getFileExtension,
  isSupportedImage,
  type UploadedImage,
} from "@/lib/image-upload";
import { performanceManager } from "@/services/image-experience";
import { ImagePreview } from "./image-preview";

interface UploadAreaProps {
  selectedImage: UploadedImage | null;
  onImageChange: (image: UploadedImage | null) => void;
}

/**
 * Studio upload surface with multi-upload, active image selection,
 * replace/remove controls, zoom preview, crop guide, and rotation preview.
 */
export function UploadArea({ selectedImage, onImageChange }: UploadAreaProps) {
  const [imageQueue, setImageQueue] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [cropMode, setCropMode] = useState(false);
  const queueRef = useRef<UploadedImage[]>([]);

  useEffect(() => {
    queueRef.current = imageQueue;
  }, [imageQueue]);

  useEffect(() => {
    return () => {
      queueRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const resetPreviewControls = () => {
    setZoom(1);
    setRotation(0);
    setCropMode(false);
  };

  const handleFiles = async (files: File[]) => {
    setError(null);
    setSuccess(null);

    const validImages: UploadedImage[] = [];
    const rejectedFiles: string[] = [];

    for (const file of files) {
      if (!isSupportedImage(file)) {
        rejectedFiles.push(file.name);
        continue;
      }
      const optimizedFile = await performanceManager.compressImage(file);
      validImages.push({ file: optimizedFile, previewUrl: URL.createObjectURL(optimizedFile) });
    }

    if (rejectedFiles.length) {
      setError(`Unsupported file${rejectedFiles.length > 1 ? "s" : ""}: ${rejectedFiles.join(", ")}. Use JPG, PNG, HEIC, or WEBP.`);
    }

    if (!validImages.length) return;

    setImageQueue((current) => [...validImages, ...current]);
    onImageChange(validImages[0]);
    resetPreviewControls();
    setSuccess(validImages.length === 1 ? "Image uploaded. Use the preview tools or continue the wizard." : `${validImages.length} images uploaded. The first image is selected for generation.`);
  };

  const selectImage = (image: UploadedImage) => {
    onImageChange(image);
    resetPreviewControls();
  };

  const removeImage = (image: UploadedImage) => {
    setImageQueue((current) => {
      const next = current.filter((item) => item.previewUrl !== image.previewUrl);
      if (selectedImage?.previewUrl === image.previewUrl) {
        const replacement = next[0] ?? null;
        onImageChange(replacement);
        resetPreviewControls();
      }
      URL.revokeObjectURL(image.previewUrl);
      return next;
    });
  };

  const clearActiveImage = () => {
    if (selectedImage) removeImage(selectedImage);
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="grid gap-6">
      <UploadCard onFiles={handleFiles} />

      {error ? (
        <div className="flex items-start gap-3 rounded-3xl border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive-foreground">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      {success ? (
        <div className="flex items-start justify-between gap-3 rounded-3xl border border-primary/30 bg-primary/10 p-4 text-sm text-foreground">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p>{success}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            aria-label="Dismiss upload success message"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {imageQueue.length ? (
        <div className="grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-black uppercase tracking-[0.22em] text-primary">Uploaded Images</h3>
            {selectedImage ? (
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}>
                  <Replace aria-hidden="true" /> Replace / Add
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={clearActiveImage}>
                  <Trash2 aria-hidden="true" /> Remove Active
                </Button>
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {imageQueue.map((image) => (
              <ImageCard
                key={image.previewUrl}
                src={image.previewUrl}
                name={image.file.name}
                isActive={selectedImage?.previewUrl === image.previewUrl}
                onSelect={() => selectImage(image)}
                onRemove={() => removeImage(image)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {selectedImage ? (
        <div className="grid gap-6">
          <PreviewPanel
            src={selectedImage.previewUrl}
            alt={`Interactive preview of ${selectedImage.file.name}`}
            zoom={zoom}
            rotation={rotation}
            cropMode={cropMode}
            onZoomIn={() => setZoom((value) => Math.min(2.2, value + 0.1))}
            onZoomOut={() => setZoom((value) => Math.max(0.6, value - 0.1))}
            onRotateLeft={() => setRotation((value) => value - 90)}
            onRotateRight={() => setRotation((value) => value + 90)}
            onToggleCrop={() => setCropMode((value) => !value)}
          />
          <ImagePreview
            previewUrl={selectedImage.previewUrl}
            fileName={selectedImage.file.name}
            fileSize={formatFileSize(selectedImage.file.size)}
            fileType={selectedImage.file.type || getFileExtension(selectedImage.file.name).toUpperCase()}
          />
        </div>
      ) : null}
    </div>
  );
}
