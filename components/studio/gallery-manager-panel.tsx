"use client";

import { useEffect, useState } from "react";
import { Copy, FolderInput, Heart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { galleryManager } from "@/services/image-experience";

interface ProjectOption {
  id: string;
  name: string;
}

interface GalleryManagerPanelProps {
  imageId?: string;
}

/** Result-level gallery actions for saved generated images. */
export function GalleryManagerPanel({ imageId }: GalleryManagerPanelProps) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [projectId, setProjectId] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const response = await fetch("/api/projects");
      if (!response.ok) return;
      const data = (await response.json()) as ProjectOption[];
      setProjects(data);
      setProjectId(data[0]?.id ?? "");
    }
    void loadProjects();
  }, []);

  const run = async (action: () => Promise<Response>, success: string) => {
    if (!imageId) return;
    const response = await action();
    setMessage(response.ok ? success : "Action failed. Please try again.");
  };

  if (!imageId) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-muted-foreground">
        Gallery actions will be available after the generated image is saved.
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const next = !isFavorite;
            setIsFavorite(next);
            void run(() => galleryManager.favorite(imageId, next), next ? "Marked as favorite." : "Removed from favorites.");
          }}
        >
          <Heart className={isFavorite ? "fill-primary" : undefined} aria-hidden="true" /> Favorite
        </Button>
        <Button type="button" variant="outline" onClick={() => run(() => galleryManager.duplicate(imageId), "Image duplicated.")}>
          <Copy aria-hidden="true" /> Duplicate
        </Button>
        <Button type="button" variant="destructive" onClick={() => run(() => galleryManager.delete(imageId), "Image deleted.")}>
          <Trash2 aria-hidden="true" /> Delete
        </Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <select
          value={projectId}
          onChange={(event) => setProjectId(event.target.value)}
          className="h-11 rounded-2xl border border-input bg-white/[0.04] px-3 text-sm text-foreground"
          aria-label="Move generated image to project"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id} className="bg-card text-foreground">
              {project.name}
            </option>
          ))}
        </select>
        <Button type="button" variant="outline" disabled={!projectId} onClick={() => run(() => galleryManager.move(imageId, projectId), "Image moved.")}>
          <FolderInput aria-hidden="true" /> Move to Project
        </Button>
      </div>

      {message ? <p className="text-sm text-primary">{message}</p> : null}
    </div>
  );
}
