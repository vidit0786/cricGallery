export const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "heif"] as const;

export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export interface UploadedImage {
  file: File;
  previewUrl: string;
}

/** Converts raw bytes into a readable file size for previews and review cards. */
export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kilobytes = bytes / 1024;
  if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
  return `${(kilobytes / 1024).toFixed(1)} MB`;
}

export function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

/**
 * Validates supported browser-selected image files.
 * HEIC/HEIF may arrive with an empty MIME type, so file extension is checked too.
 */
export function isSupportedImage(file: File) {
  const extension = getFileExtension(file.name);
  const hasSupportedExtension = ACCEPTED_IMAGE_EXTENSIONS.includes(
    extension as (typeof ACCEPTED_IMAGE_EXTENSIONS)[number],
  );
  const hasSupportedMime = file.type
    ? ACCEPTED_IMAGE_MIME_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_MIME_TYPES)[number])
    : false;

  return hasSupportedExtension || hasSupportedMime;
}

export const IMAGE_ACCEPT_VALUE = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ...ACCEPTED_IMAGE_MIME_TYPES,
].join(",");
