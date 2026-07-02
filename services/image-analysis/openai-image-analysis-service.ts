import type { ImageAnalysis, ImageAnalysisService, UploadedImageInput } from "@/types/ai";
import type { ServerConfig } from "@/config/env";
import { AppError, mapOpenAIStatus } from "@/utils/api-errors";
import { imageToDataUrl } from "@/utils/server-image";

const analysisFallback: ImageAnalysis = {
  face: {
    detected: false,
    location: null,
    angle: null,
    expression: null,
  },
  hairStyle: null,
  hairColor: null,
  beardOrMoustache: null,
  glasses: null,
  skinTone: null,
  genderPresentation: null,
  estimatedAgeRange: null,
  clothingDescription: null,
  background: null,
  lighting: null,
  cameraAngle: null,
  pose: null,
  bodyOrientation: null,
  headDirection: null,
  standingPose: null,
  sittingPose: null,
  walkingPose: null,
  runningPose: null,
  armPosition: null,
  cameraDistance: null,
  backgroundType: null,
  environmentType: null,
  portraitVsFullBody: null,
  emptySpaceAroundSubject: null,
  imageQuality: null,
  notes: [],
};

const analysisPrompt = `Analyze the uploaded person image for a future cricket portrait transformation.
Return ONLY valid JSON. Do not include markdown.
Do not identify the person. Do not infer ethnicity, nationality, religion, health, or any sensitive identity.
For genderPresentation, only include a short visible presentation phrase when confidently inferable from the image; otherwise return null.
For estimatedAgeRange, use a broad range such as "20s", "30s", or null if uncertain.
Face location should be approximate normalized coordinates from 0 to 1: x, y, width, height.
Also assess cricket-recommendation cues: head direction, body orientation, standing/sitting/walking/running pose, arm position, camera distance, background type, indoor/outdoor, portrait vs full body, and empty space around the subject.
If something is not visible or uncertain, return null rather than guessing.

JSON shape:
{
  "face": { "detected": boolean, "location": {"x": number, "y": number, "width": number, "height": number} | null, "angle": string | null, "expression": string | null },
  "hairStyle": string | null,
  "hairColor": string | null,
  "beardOrMoustache": string | null,
  "glasses": string | null,
  "skinTone": string | null,
  "genderPresentation": string | null,
  "estimatedAgeRange": string | null,
  "clothingDescription": string | null,
  "background": string | null,
  "lighting": string | null,
  "cameraAngle": string | null,
  "pose": string | null,
  "bodyOrientation": string | null,
  "headDirection": string | null,
  "standingPose": boolean | null,
  "sittingPose": boolean | null,
  "walkingPose": boolean | null,
  "runningPose": boolean | null,
  "armPosition": string | null,
  "cameraDistance": string | null,
  "backgroundType": string | null,
  "environmentType": "indoor" | "outdoor" | "uncertain" | null,
  "portraitVsFullBody": "portrait" | "half_body" | "full_body" | "uncertain" | null,
  "emptySpaceAroundSubject": "none" | "low" | "medium" | "high" | null,
  "imageQuality": string | null,
  "notes": string[]
}`;

function stripJsonFences(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function normalizeAnalysis(value: unknown): ImageAnalysis {
  if (!value || typeof value !== "object") {
    return analysisFallback;
  }

  const input = value as Partial<ImageAnalysis>;

  return {
    ...analysisFallback,
    ...input,
    face: {
      ...analysisFallback.face,
      ...(input.face ?? {}),
    },
    notes: Array.isArray(input.notes) ? input.notes : [],
  };
}

export class OpenAIImageAnalysisService implements ImageAnalysisService {
  constructor(private readonly config: ServerConfig["openAI"]) {}

  async analyzeImage(image: UploadedImageInput): Promise<ImageAnalysis> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(this.config.timeoutMs),
      body: JSON.stringify({
        model: this.config.visionModel,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a careful visual analysis service. You return structured JSON for prompt generation and avoid unsupported guesses.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              {
                type: "image_url",
                image_url: {
                  url: imageToDataUrl(image),
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw mapOpenAIStatus(response.status);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new AppError("The AI image analysis response was empty. Please try again.", 502, "AI_SERVICE_ERROR");
    }

    try {
      return normalizeAnalysis(JSON.parse(stripJsonFences(content)));
    } catch {
      throw new AppError("The AI image analysis response could not be parsed. Please try again.", 502, "AI_SERVICE_ERROR");
    }
  }
}
