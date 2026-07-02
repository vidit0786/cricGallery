export interface GalleryImageActions {
  imageId?: string;
  onFavorite?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onDuplicate?: () => Promise<void> | void;
  onMove?: (projectId: string) => Promise<void> | void;
}

export class GalleryManager {
  async favorite(imageId: string, isFavorite: boolean) {
    return fetch(`/api/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite }),
    });
  }

  async delete(imageId: string) {
    return fetch(`/api/images/${imageId}`, { method: "DELETE" });
  }

  async duplicate(imageId: string) {
    return fetch(`/api/images/${imageId}/duplicate`, { method: "POST" });
  }

  async move(imageId: string, projectId: string) {
    return fetch(`/api/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
  }
}

export const galleryManager = new GalleryManager();
