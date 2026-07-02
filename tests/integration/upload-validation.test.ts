import { describe, expect, it } from "vitest";

import { fileToUploadedImageInput, MAX_IMAGE_SIZE_BYTES } from "@/utils/server-image";

function fileFromBytes(bytes: number[], type: string, name = "test.png") {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe("server upload validation", () => {
  it("accepts a valid PNG by MIME and magic bytes", async () => {
    const file = fileFromBytes([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3], "image/png");
    const image = await fileToUploadedImageInput(file);

    expect(image.mimeType).toBe("image/png");
    expect(image.fileName).toBe("test.png");
  });

  it("rejects MIME spoofing", async () => {
    const file = fileFromBytes([1, 2, 3, 4], "image/png");
    await expect(fileToUploadedImageInput(file)).rejects.toThrow("file content");
  });

  it("documents the upload size limit", () => {
    expect(MAX_IMAGE_SIZE_BYTES).toBe(15 * 1024 * 1024);
  });
});
