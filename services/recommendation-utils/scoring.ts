export function clampConfidence(value: number) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

export function confidenceToStars(confidence: number) {
  if (confidence >= 90) return 5;
  if (confidence >= 78) return 4;
  if (confidence >= 64) return 3;
  if (confidence >= 48) return 2;
  return 1;
}

export function includesAny(value: string | null | undefined, terms: string[]) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return terms.some((term) => normalized.includes(term.toLowerCase()));
}

export function starsLabel(stars: number) {
  return "★".repeat(stars) + "☆".repeat(Math.max(0, 5 - stars));
}
