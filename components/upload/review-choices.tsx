import { Pencil } from "lucide-react";

import { ImagePreview } from "@/components/upload/image-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CricketSelections } from "@/lib/cricket-options";
import { formatFileSize, getFileExtension, type UploadedImage } from "@/lib/image-upload";

interface ReviewChoicesProps {
  image: UploadedImage | null;
  selections: CricketSelections;
  onEditStep: (stepIndex: number) => void;
}

const reviewRows: Array<{ label: string; key: keyof CricketSelections; stepIndex: number }> = [
  { label: "Cricket Format", key: "format", stepIndex: 1 },
  { label: "Team", key: "team", stepIndex: 2 },
  { label: "Player Role", key: "role", stepIndex: 3 },
  { label: "Cricket Pose", key: "pose", stepIndex: 4 },
  { label: "Batting Shot", key: "battingShot", stepIndex: 9 },
  { label: "Bowling Action", key: "bowlingAction", stepIndex: 9 },
  { label: "Celebration", key: "celebrationStyle", stepIndex: 9 },
  { label: "Stadium", key: "stadium", stepIndex: 5 },
  { label: "Crowd Level", key: "crowdLevel", stepIndex: 9 },
  { label: "Stadium Effect", key: "stadiumEffect", stepIndex: 9 },
  { label: "Match Time", key: "matchTime", stepIndex: 6 },
  { label: "Camera Style", key: "cameraStyle", stepIndex: 7 },
  { label: "Lighting Style", key: "lightingStyle", stepIndex: 8 },
  { label: "Player Name", key: "playerName", stepIndex: 10 },
  { label: "Jersey Number", key: "jerseyNumber", stepIndex: 10 },
  { label: "Sleeve Style", key: "sleeveStyle", stepIndex: 10 },
  { label: "Fit Style", key: "fitStyle", stepIndex: 10 },
  { label: "Aspect Ratio", key: "aspectRatio", stepIndex: 11 },
  { label: "Quality", key: "qualityLevel", stepIndex: 11 },
  { label: "Target Resolution", key: "targetResolution", stepIndex: 11 },
  { label: "Export Target", key: "exportTarget", stepIndex: 11 },
  { label: "Prompt Preset", key: "promptPreset", stepIndex: 11 },
];

function displayValue(value: CricketSelections[keyof CricketSelections]) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value ?? "Not selected";
}

/** Review card for all locally collected wizard choices. */
export function ReviewChoices({ image, selections, onEditStep }: ReviewChoicesProps) {
  return (
    <div className="grid gap-6">
      {image ? (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-foreground">Uploaded image preview</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => onEditStep(0)}>
              <Pencil aria-hidden="true" /> Edit image
            </Button>
          </div>
          <ImagePreview
            previewUrl={image.previewUrl}
            fileName={image.file.name}
            fileSize={formatFileSize(image.file.size)}
            fileType={image.file.type || getFileExtension(image.file.name).toUpperCase()}
          />
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Review your cricket scene</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {reviewRows.map((row) => (
            <div
              key={row.key}
              className="flex flex-col justify-between gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">{row.label}</p>
                <p className="mt-1 text-lg font-black text-foreground">{displayValue(selections[row.key])}</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => onEditStep(row.stepIndex)}>
                <Pencil aria-hidden="true" /> Edit
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
