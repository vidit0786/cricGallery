export interface ProgressState {
  stage: "queued" | "analyzing" | "prompt" | "generating" | "saving" | "complete";
  value: number;
  label: string;
}

export class PerformanceManager {
  private cache = new Map<string, string>();

  cacheImage(key: string, dataUrl: string) {
    this.cache.set(key, dataUrl);
  }

  getCachedImage(key: string) {
    return this.cache.get(key);
  }

  getProgress(stage: ProgressState["stage"]): ProgressState {
    const states: Record<ProgressState["stage"], ProgressState> = {
      queued: { stage: "queued", value: 8, label: "Queued" },
      analyzing: { stage: "analyzing", value: 28, label: "Analyzing image" },
      prompt: { stage: "prompt", value: 52, label: "Building prompt" },
      generating: { stage: "generating", value: 78, label: "Generating image" },
      saving: { stage: "saving", value: 92, label: "Saving result" },
      complete: { stage: "complete", value: 100, label: "Complete" },
    };

    return states[stage];
  }

  async compressImage(file: File, maxSize = 1600, quality = 0.9): Promise<File> {
    if (!file.type.startsWith("image/") || file.type.includes("heic") || file.type.includes("heif")) return file;

    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, file.type === "image/png" ? "image/png" : "image/jpeg", quality));
    if (!blob) return file;

    return new File([blob], file.name, { type: blob.type, lastModified: file.lastModified });
  }
}

export const performanceManager = new PerformanceManager();
