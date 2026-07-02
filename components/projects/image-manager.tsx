"use client";

import Image from "next/image";
import { useState } from "react";
import { Copy, Download, Heart, MoveRight, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DOWNLOAD_PRESETS, downloadImageWithPreset } from "@/utils/image-download";

interface ProjectOption {
  id: string;
  name: string;
}

interface ImageItem {
  id: string;
  projectId: string;
  name: string;
  generatedImageDataUrl: string;
  promptVersion: string;
  imageProvider: string;
  isFavorite: boolean;
  createdAt: string | Date;
}

export function ImageManager({ initialImages, projects }: { initialImages: ImageItem[]; projects: ProjectOption[] }) {
  const [images, setImages] = useState(initialImages);

  const renameImage = async (image: ImageItem) => {
    const name = window.prompt("Rename image", image.name);
    if (!name?.trim()) return;
    const response = await fetch(`/api/images/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!response.ok) return;
    setImages((current) => current.map((item) => (item.id === image.id ? { ...item, name: name.trim() } : item)));
  };

  const toggleFavorite = async (image: ImageItem) => {
    const response = await fetch(`/api/images/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: !image.isFavorite }),
    });
    if (!response.ok) return;
    setImages((current) => current.map((item) => (item.id === image.id ? { ...item, isFavorite: !item.isFavorite } : item)));
  };

  const duplicateImage = async (image: ImageItem) => {
    const response = await fetch(`/api/images/${image.id}/duplicate`, { method: "POST" });
    if (!response.ok) return;
    const copy = (await response.json()) as ImageItem;
    setImages((current) => [copy, ...current]);
  };

  const moveImage = async (image: ImageItem) => {
    const targetProjectId = window.prompt(
      `Move to project id:\n${projects.map((project) => `${project.name}: ${project.id}`).join("\n")}`,
      image.projectId,
    );
    if (!targetProjectId) return;
    const response = await fetch(`/api/images/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: targetProjectId }),
    });
    if (!response.ok) return;
    setImages((current) => current.filter((item) => item.id !== image.id));
  };

  const deleteImage = async (image: ImageItem) => {
    if (!window.confirm(`Delete image "${image.name}"?`)) return;
    const response = await fetch(`/api/images/${image.id}`, { method: "DELETE" });
    if (!response.ok) return;
    setImages((current) => current.filter((item) => item.id !== image.id));
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <article key={image.id} className="rounded-3xl border border-white/10 bg-card/70 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-black/25">
            <Image src={image.generatedImageDataUrl} alt={image.name} fill sizes="360px" className="object-cover" unoptimized />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-black text-foreground">{image.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {image.imageProvider} · Prompt {image.promptVersion}
              </p>
            </div>
            <button type="button" onClick={() => toggleFavorite(image)} className="text-primary" aria-label="Toggle favorite image">
              <Heart className={image.isFavorite ? "fill-primary" : undefined} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => renameImage(image)}>
              <Pencil aria-hidden="true" /> Rename
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => duplicateImage(image)}>
              <Copy aria-hidden="true" /> Duplicate
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => moveImage(image)}>
              <MoveRight aria-hidden="true" /> Move
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => downloadImageWithPreset(image.generatedImageDataUrl, DOWNLOAD_PRESETS[0])}>
              <Download aria-hidden="true" /> HD
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={() => deleteImage(image)}>
              <Trash2 aria-hidden="true" /> Delete
            </Button>
          </div>
        </article>
      ))}
      {!images.length ? <p className="text-sm text-muted-foreground">No images in this project yet.</p> : null}
    </div>
  );
}
