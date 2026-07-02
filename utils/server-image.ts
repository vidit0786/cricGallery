import type { UploadedImageInput } from "@/types/ai";
import { AppError } from "@/utils/api-errors";
import { sanitizeFileName } from "@/utils/sanitize";

export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024;
const AI_PROVIDER_SUPPORTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UPLOAD_SUPPORTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

function sniffMimeType(buffer: Buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") return "image/webp";
  if (buffer.length >= 12 && buffer.subarray(4, 8).toString() === "ftyp") {
    const brand = buffer.subarray(8, 12).toString().toLowerCase();
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) return "image/heic";
  }
  return null;
}

export async function fileToUploadedImageInput(file: File): Promise<UploadedImageInput> {
  if (!file.type.startsWith("image/")) {
    throw new AppError("Please upload a valid image file.", 400, "INVALID_IMAGE");
  }

  if (file.size <= 0) {
    throw new AppError("The uploaded image is empty. Please choose another file.", 400, "INVALID_IMAGE");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new AppError("Please upload an image smaller than 15 MB.", 400, "INVALID_IMAGE");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffedType = sniffMimeType(buffer);

  if (!sniffedType || !UPLOAD_SUPPORTED_MIME_TYPES.has(sniffedType)) {
    throw new AppError("The uploaded file content does not match a supported image type.", 400, "INVALID_IMAGE");
  }

  if (file.type && UPLOAD_SUPPORTED_MIME_TYPES.has(file.type) && file.type !== sniffedType) {
    throw new AppError("The uploaded file extension or MIME type does not match the actual image content.", 400, "INVALID_IMAGE");
  }

  return {
    buffer,
    mimeType: sniffedType,
    fileName: sanitizeFileName(file.name || "uploaded-image"),
  };
}

export function assertImageGenerationSupported(image: UploadedImageInput) {
  if (!AI_PROVIDER_SUPPORTED_MIME_TYPES.has(image.mimeType)) {
    throw new AppError(
      "AI generation currently supports JPG, PNG, and WEBP images. Please convert HEIC/HEIF images before generating.",
      400,
      "INVALID_IMAGE",
    );
  }
}

export function imageToDataUrl(image: UploadedImageInput) {
  return `data:${image.mimeType};base64,${image.buffer.toString("base64")}`;
}

export function imageToBlob(image: UploadedImageInput) {
  return new Blob([new Uint8Array(image.buffer)], { type: image.mimeType });
}
