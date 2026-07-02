import type { ServerConfig } from "@/config/env";
import type { GeneratedImage, GenerateImageInput, ImageGenerator } from "@/types/ai";
import { AppError, mapOpenAIStatus } from "@/utils/api-errors";
import { assertImageGenerationSupported, imageToBlob } from "@/utils/server-image";

interface OpenAIImageResponse {
  data?: Array<{
    b64_json?: string;
    url?: string;
  }>;
}

async function imageUrlToDataUrl(url: string, timeoutMs: number) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });

  if (!response.ok) {
    throw new AppError("The generated image could not be downloaded from the AI service.", 502, "AI_SERVICE_ERROR");
  }

  const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "image/png";
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return { dataUrl: `data:${mimeType};base64,${base64}`, mimeType };
}

/** Initial swappable ImageGenerator implementation backed by OpenAI GPT Image API. */
export class OpenAIImageGenerator implements ImageGenerator {
  constructor(private readonly config: ServerConfig["openAI"]) {}

  async generateImage({ prompt, sourceImage }: GenerateImageInput): Promise<GeneratedImage> {
    assertImageGenerationSupported(sourceImage);

    const formData = new FormData();
    formData.append("model", this.config.imageModel);
    formData.append("prompt", prompt);
    formData.append("size", this.config.imageSize);
    formData.append("quality", this.config.imageQuality);
    formData.append("image", imageToBlob(sourceImage), sourceImage.fileName);

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      signal: AbortSignal.timeout(this.config.timeoutMs),
      body: formData,
    });

    if (!response.ok) {
      throw mapOpenAIStatus(response.status);
    }

    const payload = (await response.json()) as OpenAIImageResponse;
    const image = payload.data?.[0];

    if (!image?.b64_json && !image?.url) {
      throw new AppError("The AI image service returned no generated image. Please try again.", 502, "AI_SERVICE_ERROR");
    }

    if (image.b64_json) {
      return {
        dataUrl: `data:image/png;base64,${image.b64_json}`,
        mimeType: "image/png",
        provider: "openai",
        model: this.config.imageModel,
      };
    }

    const downloaded = await imageUrlToDataUrl(image.url!, this.config.timeoutMs);

    return {
      ...downloaded,
      provider: "openai",
      model: this.config.imageModel,
    };
  }
}
