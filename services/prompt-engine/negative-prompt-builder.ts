const coreNegativeTerms = [
  "extra fingers",
  "extra arms",
  "extra legs",
  "duplicate people",
  "duplicate players",
  "face distortion",
  "changed identity",
  "broken anatomy",
  "crossed eyes",
  "blurry face",
  "blurry eyes",
  "wrong cricket equipment",
  "incorrect cricket bat",
  "incorrect cricket ball",
  "incorrect pads",
  "incorrect gloves",
  "floating equipment",
  "cartoon style",
  "anime style",
  "comic illustration",
  "watermarks",
  "text overlays",
  "logo artifacts",
  "noise",
  "low resolution",
  "poor lighting",
  "plastic skin",
  "waxy skin",
  "AI artifacts",
];

export class NegativePromptBuilder {
  build() {
    return [
      "NEGATIVE PROMPT — strictly prevent:",
      `${coreNegativeTerms.join(", ")}.`,
      "Do not invent extra people unless explicitly requested by the selected celebration or crowd context.",
      "Do not add readable fake text, random watermarks, corrupted sponsor marks, malformed cricket gear, distorted hands, or non-cricket accessories.",
    ].join("\n");
  }
}

/** Strong reusable negative prompt block appended to every generation prompt. */
export function buildNegativePromptBlock() {
  return new NegativePromptBuilder().build();
}
