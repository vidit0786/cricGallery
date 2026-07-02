import type { CameraStyle } from "@/lib/cricket-options";

const cameraInstructions: Record<CameraStyle, string> = {
  "Broadcast Camera":
    "Camera: premium broadcast camera angle from the boundary line, realistic sports telecast framing, natural lens compression, and broadcast-safe composition.",
  "Telephoto Lens":
    "Camera: 200mm telephoto lens look, strong subject isolation, compressed stadium background, sharp face and eyes, realistic crowd bokeh.",
  "Close-up Portrait":
    "Camera: close-up professional athlete portrait framing, face and upper body sharp, premium portrait depth of field, stadium softly blurred behind the player.",
  "Action Camera":
    "Camera: dynamic action camera style with crisp subject freeze, realistic motion cues, intense sports timing, and authentic action framing.",
  Drone:
    "Camera: controlled drone-style elevated stadium perspective while keeping the player prominent, recognizable, and correctly scaled in the arena.",
  "Ground Level":
    "Camera: ground-level sports photography perspective near the pitch with dramatic scale, accurate grass texture, and powerful player presence.",
  "Wide Stadium":
    "Camera: wide stadium composition showing realistic crowd, field placement, boundary rope, pitch, and arena scale without losing subject clarity.",
  "Slow Motion Style":
    "Camera: slow-motion sports photography style with frozen peak-action detail, subtle motion atmosphere, sharp face, and cinematic dramatic timing.",
};

export function buildCameraInstruction(cameraStyle: CameraStyle) {
  return cameraInstructions[cameraStyle];
}
