export type DownloadPresetId =
  | "hd"
  | "4k"
  | "8k"
  | "instagram_post"
  | "instagram_story"
  | "facebook_cover"
  | "youtube_thumbnail"
  | "linkedin_banner"
  | "wallpaper"
  | "poster";

export interface DownloadPreset {
  id: DownloadPresetId;
  label: string;
  width: number;
  height: number;
}

export const DOWNLOAD_PRESETS: DownloadPreset[] = [
  { id: "hd", label: "HD", width: 1920, height: 1080 },
  { id: "4k", label: "4K", width: 3840, height: 2160 },
  { id: "8k", label: "8K", width: 7680, height: 4320 },
  { id: "instagram_post", label: "Instagram Post", width: 1080, height: 1080 },
  { id: "instagram_story", label: "Instagram Story", width: 1080, height: 1920 },
  { id: "facebook_cover", label: "Facebook Cover", width: 1640, height: 924 },
  { id: "youtube_thumbnail", label: "YouTube Thumbnail", width: 1280, height: 720 },
  { id: "linkedin_banner", label: "LinkedIn Banner", width: 1584, height: 396 },
  { id: "wallpaper", label: "Wallpaper", width: 2560, height: 1440 },
  { id: "poster", label: "Poster", width: 2400, height: 3600 },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not prepare the generated image for download."));
    image.src = src;
  });
}

/** Downloads a generated data URL using cover-crop canvas sizing for the selected preset. */
export async function downloadImageWithPreset(dataUrl: string, preset: DownloadPreset) {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = preset.width;
  canvas.height = preset.height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not prepare this image size for download.");

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const scale = Math.max(preset.width / image.width, preset.height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const dx = (preset.width - drawWidth) / 2;
  const dy = (preset.height - drawHeight) / 2;

  context.drawImage(image, dx, dy, drawWidth, drawHeight);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.95));
  if (!blob) throw new Error("Your browser could not export this image size. Try a smaller preset.");

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cricket-ai-studio-${preset.id}-${preset.width}x${preset.height}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
