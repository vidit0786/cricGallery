export function sanitizeText(value: string, maxLength = 500) {
  return value
    .slice(0, maxLength)
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

export function sanitizeFileName(value: string) {
  return sanitizeText(value, 120).replace(/[^a-zA-Z0-9._ -]/g, "_");
}
