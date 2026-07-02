"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { ImagePlus, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGE_ACCEPT_VALUE } from "@/lib/image-upload";
import { cn } from "@/lib/utils";

interface UploadCardProps {
  onFiles: (files: File[]) => void | Promise<void>;
}

/** Premium drag-and-drop card with multiple upload support. */
export function UploadCard({ onFiles }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList?: FileList | null) => {
    if (!fileList?.length) return;
    onFiles(Array.from(fileList));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-dashed transition-all duration-300",
        isDragging ? "border-primary bg-primary/[0.12] shadow-[0_0_80px_rgba(183,249,90,0.2)]" : "border-white/[0.18] bg-card/65",
      )}
    >
      <CardContent className="p-4 sm:p-6">
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            if (event.currentTarget === event.target) setIsDragging(false);
          }}
          onDrop={handleDrop}
          className="cricket-grid flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/[0.18] p-8 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Upload one or more source images"
        >
          <input ref={inputRef} type="file" accept={IMAGE_ACCEPT_VALUE} multiple className="hidden" onChange={handleInputChange} />
          <div className="grid size-20 place-items-center rounded-3xl border border-primary/30 bg-primary/[0.12] text-primary shadow-[0_0_38px_rgba(183,249,90,0.18)]">
            {isDragging ? <UploadCloud className="size-9" aria-hidden="true" /> : <ImagePlus className="size-9" aria-hidden="true" />}
          </div>
          <h2 className="mt-7 max-w-2xl text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Drop cricket portraits here
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            Upload one or multiple JPG, PNG, HEIC, or WEBP images. Select a thumbnail to choose the active generation source.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button type="button" size="lg">
              Browse images
              <UploadCloud aria-hidden="true" />
            </Button>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">JPG · PNG · HEIC · WEBP</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
