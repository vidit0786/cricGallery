"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, FolderPlus, RefreshCw, Sparkles } from "lucide-react";

import { AiRecommendationsPanel } from "@/components/recommendation-ui/ai-recommendations-panel";
import { AiGenerationResult } from "@/components/upload/ai-generation-result";
import { AiProcessingProgress, type ProcessingStage } from "@/components/upload/ai-processing-progress";
import { SettingsPanel } from "@/components/studio/settings-panel";
import { StudioSidebar } from "@/components/studio/studio-sidebar";
import { StudioToolbar } from "@/components/studio/studio-toolbar";
import { OptionGrid } from "@/components/upload/option-grid";
import { ReviewChoices } from "@/components/upload/review-choices";
import { UploadArea } from "@/components/upload/upload-area";
import { WizardProgress } from "@/components/upload/wizard-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ASPECT_RATIOS,
  BATTING_SHOTS,
  BOWLING_ACTIONS,
  CAMERA_STYLES,
  CELEBRATION_STYLES,
  CRICKET_FORMATS,
  CRICKET_POSES,
  EXPORT_TARGETS,
  FIT_STYLES,
  LIGHTING_STYLES,
  MATCH_TIMES,
  PLAYER_ROLES,
  PROMPT_PRESETS,
  QUALITY_LEVELS,
  SLEEVE_STYLES,
  STADIUMS,
  STADIUM_CROWD_LEVELS,
  STADIUM_EFFECTS,
  TARGET_RESOLUTIONS,
  getTeamOptions,
  isSelectionComplete,
  type CameraStyle,
  type CricketFormat,
  type CricketPose,
  type CricketSelections,
  type CricketTeam,
  type LightingStyle,
  type MatchTime,
  type PlayerRole,
  type Stadium,
} from "@/lib/cricket-options";
import type { UploadedImage } from "@/lib/image-upload";
import type { CricketGenerationResult, ImageVariationMode } from "@/types/ai";
import type { CricketRecommendationResult } from "@/types/recommendation-types";

const wizardSteps = [
  { id: "upload", title: "Upload Image" },
  { id: "format", title: "Format" },
  { id: "team", title: "Team" },
  { id: "role", title: "Role" },
  { id: "pose", title: "Pose" },
  { id: "stadium", title: "Stadium" },
  { id: "time", title: "Match Time" },
  { id: "camera", title: "Camera" },
  { id: "lighting", title: "Lighting" },
  { id: "advanced", title: "Advanced Cricket" },
  { id: "jersey", title: "Jersey" },
  { id: "output", title: "Output" },
  { id: "review", title: "Review" },
  { id: "generate", title: "Generate" },
];

const formatDescriptions: Record<CricketFormat, string> = {
  IPL: "Franchise cricket with official league styling and high-energy stadium visuals.",
  International: "National team presentation with broadcast-ready sports photography.",
  "World Cup": "Global tournament atmosphere with premium match-day drama.",
  Test: "Classic whites, heritage mood, and long-format cricket elegance.",
  ODI: "One-day international styling with crisp professional action imagery.",
  T20: "Fast, colorful, modern cricket with explosive stadium energy.",
  "Street Cricket": "Local cricket personality with realistic urban sporting character.",
};

const roleDescriptions: Record<PlayerRole, string> = {
  Batsman: "Hero batting focus with strong stance and confident presence.",
  Bowler: "Dynamic bowling identity with pace, spin, or follow-through energy.",
  "All-rounder": "Balanced cricket persona combining batting, bowling, and leadership cues.",
  Captain: "Commanding body language with strategic, leader-like presence.",
  "Wicket Keeper": "Gloves, alert posture, and sharp behind-the-stumps intensity.",
  Coach: "Professional mentor presence for training, nets, and tactical scenes.",
};

const matchTimeDescriptions: Record<MatchTime, string> = {
  "Day Match": "Bright natural daylight, clean turf tones, and sharp broadcast clarity.",
  "Night Match": "Floodlights, dramatic contrast, and premium evening stadium atmosphere.",
  "Sunset Match": "Golden-hour light, cinematic sky colors, and warm highlights.",
  "Rain Match": "Wet pitch mood, rain drama, reflections, and gritty realism.",
};

const cameraDescriptions: Record<CameraStyle, string> = {
  "Broadcast Camera": "Premium sports telecast framing from boundary or pitch-side.",
  "Telephoto Lens": "Compressed 200mm look with subject isolation and crowd bokeh.",
  "Close-up Portrait": "Identity-forward athlete portrait with shallow depth of field.",
  "Action Camera": "Dynamic, crisp peak-action sports timing.",
  Drone: "Elevated stadium perspective while keeping the subject prominent.",
  "Ground Level": "Low-angle pitch perspective with dramatic scale and grass texture.",
  "Wide Stadium": "Arena-scale composition with field, pitch, and crowd context.",
  "Slow Motion Style": "Frozen dramatic sports moment with cinematic motion atmosphere.",
};

const lightingDescriptions: Record<LightingStyle, string> = {
  Morning: "Fresh natural light with soft shadows and clean exposure.",
  "Golden Hour": "Warm cinematic rim light with long realistic shadows.",
  Afternoon: "Bright HDR sports exposure with crisp field detail.",
  "Night Match": "Dramatic night atmosphere with controlled stadium contrast.",
  Floodlights: "Professional floodlights with natural catchlights and reflections.",
  "Rain Match": "Wet grass reflections, rain mood, and dramatic realism.",
  Cloudy: "Soft diffused light with balanced natural skin tones.",
  Sunset: "Colorful sky, cinematic highlights, and premium color grading.",
};

function poseDescription(pose: CricketPose) {
  if (["Cover Drive", "Straight Drive", "Six Hit", "Pull Shot"].includes(pose)) return "Batting-focused action pose with professional sports framing.";
  if (["Fast Bowling", "Spin Bowling"].includes(pose)) return "Bowling action sequence with momentum and athletic intensity.";
  return "Editorial cricket moment with expressive storytelling and realism.";
}

function stadiumDescription(stadium: Stadium) {
  if (stadium === "Lord's" || stadium === "The Oval") return "Iconic English cricket venue with classic sporting heritage.";
  if (stadium === "Melbourne Cricket Ground") return "Massive international arena with grand-scale broadcast atmosphere.";
  return "Premium Indian cricket stadium setting with energetic crowd ambience.";
}

interface ApiErrorPayload {
  error?: { code?: string; message?: string };
}

interface ProjectOption {
  id: string;
  name: string;
}

export function CricketCustomizationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [selections, setSelections] = useState<CricketSelections>({});
  const [generationResult, setGenerationResult] = useState<CricketGenerationResult | null>(null);
  const [recommendation, setRecommendation] = useState<CricketRecommendationResult | null>(null);
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);
  const recommendationCacheRef = useRef<Map<string, CricketRecommendationResult>>(new Map());
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [variationCount, setVariationCount] = useState(4);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("analyzing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const uploadedImageRef = useRef<UploadedImage | null>(null);

  const teamOptions = useMemo(() => getTeamOptions(selections.format), [selections.format]);

  useEffect(() => {
    uploadedImageRef.current = uploadedImage;
  }, [uploadedImage]);

  useEffect(() => {
    return () => {
      if (uploadedImageRef.current?.previewUrl) URL.revokeObjectURL(uploadedImageRef.current.previewUrl);
    };
  }, []);

  useEffect(() => {
    async function loadProjects() {
      const response = await fetch("/api/projects");
      if (!response.ok) return;
      const projectList = (await response.json()) as ProjectOption[];
      setProjects(projectList);
      setSelectedProjectId((current) => current || projectList[0]?.id || "");
    }
    void loadProjects();
  }, []);

  const requestRecommendations = async (image = uploadedImage, projectId = selectedProjectId, force = false) => {
    if (!image || !projectId) return;

    const cacheKey = `${image.file.name}:${image.file.size}:${image.file.lastModified}`;
    if (!force) {
      const cached = recommendationCacheRef.current.get(cacheKey);
      if (cached) {
        setRecommendation(cached);
        return;
      }
    }

    setIsRecommendationLoading(true);
    setRecommendationError(null);

    try {
      const formData = new FormData();
      formData.append("image", image.file);
      formData.append("projectId", projectId);

      const response = await fetch("/api/recommendations", { method: "POST", body: formData });
      const payload = (await response.json()) as CricketRecommendationResult | ApiErrorPayload;

      if (!response.ok) {
        throw new Error("error" in payload && payload.error?.message ? payload.error.message : "Could not generate recommendations.");
      }

      const result = payload as CricketRecommendationResult;
      recommendationCacheRef.current.set(cacheKey, result);
      setRecommendation(result);
    } catch (error) {
      setRecommendationError(error instanceof Error ? error.message : "Could not generate recommendations.");
    } finally {
      setIsRecommendationLoading(false);
    }
  };

  useEffect(() => {
    if (uploadedImage && selectedProjectId) void requestRecommendations(uploadedImage, selectedProjectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedImage?.previewUrl, selectedProjectId]);

  const applyRecommendations = () => {
    if (!recommendation) return;
    setSelections((current) => ({ ...current, ...recommendation.bestSettings }));
    setCurrentStep(12);
  };

  const clearGeneratedResult = () => {
    setGenerationResult(null);
    setErrorMessage(null);
  };

  const handleImageChange = (image: UploadedImage | null) => {
    clearGeneratedResult();
    setRecommendation(null);
    setRecommendationError(null);
    setUploadedImage((current) => {
      if (current?.previewUrl && current.previewUrl !== image?.previewUrl) URL.revokeObjectURL(current.previewUrl);
      return image;
    });
  };

  const updateSelection = <K extends keyof CricketSelections>(key: K, value: CricketSelections[K]) => {
    clearGeneratedResult();
    setSelections((current) => ({ ...current, [key]: value }));
  };

  const handleFormatChange = (format: CricketFormat) => {
    clearGeneratedResult();
    setSelections((current) => {
      const nextTeamOptions = getTeamOptions(format) as readonly string[];
      const shouldKeepTeam = current.team ? nextTeamOptions.includes(current.team) : false;
      return { ...current, format, team: shouldKeepTeam ? current.team : undefined };
    });
  };

  const resetWorkflow = () => {
    handleImageChange(null);
    setSelections({});
    setGenerationResult(null);
    setErrorMessage(null);
    setIsProcessing(false);
    setCurrentStep(0);
  };

  const createProjectFromWizard = async () => {
    if (!newProjectName.trim()) return;
    setIsCreatingProject(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProjectName.trim() }),
      });
      const payload = (await response.json()) as ProjectOption | ApiErrorPayload;
      if (!response.ok) throw new Error("error" in payload && payload.error?.message ? payload.error.message : "Could not create project.");
      const project = payload as ProjectOption;
      setProjects((current) => [project, ...current]);
      setSelectedProjectId(project.id);
      setNewProjectName("");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create project.");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0:
        return Boolean(uploadedImage);
      case 1:
        return Boolean(selections.format);
      case 2:
        return Boolean(selections.team);
      case 3:
        return Boolean(selections.role);
      case 4:
        return Boolean(selections.pose);
      case 5:
        return Boolean(selections.stadium);
      case 6:
        return Boolean(selections.matchTime);
      case 7:
        return Boolean(selections.cameraStyle);
      case 8:
        return Boolean(selections.lightingStyle);
      case 12:
        return Boolean(uploadedImage) && isSelectionComplete(selections);
      default:
        return true;
    }
  }, [currentStep, selections, uploadedImage]);

  const goToStep = (stepIndex: number) => setCurrentStep(Math.min(Math.max(stepIndex, 0), wizardSteps.length - 1));
  const goNext = () => canProceed && goToStep(currentStep + 1);
  const goPrevious = () => goToStep(currentStep - 1);

  const runAiWorkflow = async (variationMode?: ImageVariationMode) => {
    if (!uploadedImage || !isSelectionComplete(selections) || !selectedProjectId) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStage("analyzing");

    const timers = [window.setTimeout(() => setProcessingStage("prompt"), 1100), window.setTimeout(() => setProcessingStage("generating"), 2400)];

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage.file);
      formData.append("selections", JSON.stringify(selections));
      formData.append("projectId", selectedProjectId);
      formData.append("variationCount", String(variationCount));
      if (variationMode) formData.append("variationMode", variationMode);

      const response = await fetch("/api/cricket/generate", { method: "POST", body: formData });
      const payload = (await response.json()) as CricketGenerationResult | ApiErrorPayload;

      if (!response.ok) {
        const message = "error" in payload && payload.error?.message ? payload.error.message : "The cricket image could not be generated. Please try again.";
        throw new Error(message);
      }

      setProcessingStage("generating");
      setGenerationResult(payload as CricketGenerationResult);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Network error while generating the cricket image. Please try again.");
    } finally {
      timers.forEach(window.clearTimeout);
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepShell eyebrow="Source image" title="Upload the face reference" description="Start with a clear JPG, PNG, WEBP, or HEIC image. AI generation works best with JPG, PNG, and WEBP source files.">
            <div className="grid gap-6">
              <UploadArea selectedImage={uploadedImage} onImageChange={handleImageChange} />
              <AiRecommendationsPanel
                recommendation={recommendation}
                isLoading={isRecommendationLoading}
                error={recommendationError}
                onApply={applyRecommendations}
                onRefresh={() => void requestRecommendations(uploadedImage, selectedProjectId, true)}
              />
            </div>
          </StepShell>
        );
      case 1:
        return (
          <StepShell eyebrow="Cricket format" title="Choose the cricket universe" description="Select the competition style and broad image mood.">
            <OptionGrid options={CRICKET_FORMATS} value={selections.format} onChange={handleFormatChange} getDescription={(format) => formatDescriptions[format]} />
          </StepShell>
        );
      case 2:
        return (
          <StepShell eyebrow="Team identity" title={selections.format === "IPL" ? "Choose an IPL franchise" : "Choose a team"} description="IPL uses franchise teams. Other formats use international teams for a complete guided flow.">
            <OptionGrid options={teamOptions} value={selections.team} onChange={(team) => updateSelection("team", team as CricketTeam)} getDescription={(team) => `${team} jersey, colors, and cricket identity.`} />
          </StepShell>
        );
      case 3:
        return (
          <StepShell eyebrow="Player role" title="Define the professional role" description="Role controls equipment, posture, and cricket realism.">
            <OptionGrid options={PLAYER_ROLES} value={selections.role} onChange={(role) => updateSelection("role", role)} getDescription={(role) => roleDescriptions[role]} />
          </StepShell>
        );
      case 4:
        return (
          <StepShell eyebrow="Cricket pose" title="Pick the hero moment" description="Choose the main pose. Advanced shot/action controls come later.">
            <OptionGrid options={CRICKET_POSES} value={selections.pose} onChange={(pose) => updateSelection("pose", pose)} getDescription={poseDescription} />
          </StepShell>
        );
      case 5:
        return (
          <StepShell eyebrow="Stadium" title="Place the player on a cricket stage" description="The stadium choice controls location, scale, and broadcast atmosphere.">
            <OptionGrid options={STADIUMS} value={selections.stadium} onChange={(stadium) => updateSelection("stadium", stadium)} getDescription={stadiumDescription} />
          </StepShell>
        );
      case 6:
        return (
          <StepShell eyebrow="Match time" title="Choose the match mood" description="Match time sets broad cricket atmosphere before the lighting engine refines it.">
            <OptionGrid options={MATCH_TIMES} value={selections.matchTime} onChange={(matchTime) => updateSelection("matchTime", matchTime)} getDescription={(matchTime) => matchTimeDescriptions[matchTime]} columns="two" />
          </StepShell>
        );
      case 7:
        return (
          <StepShell eyebrow="Camera engine" title="Select the camera language" description="Camera controls composition, lens feel, depth of field, and sports-photography realism.">
            <OptionGrid options={CAMERA_STYLES} value={selections.cameraStyle} onChange={(cameraStyle) => updateSelection("cameraStyle", cameraStyle)} getDescription={(cameraStyle) => cameraDescriptions[cameraStyle]} />
          </StepShell>
        );
      case 8:
        return (
          <StepShell eyebrow="Lighting engine" title="Select the professional lighting style" description="Lighting controls natural shadows, reflections, HDR exposure, skin tones, and atmosphere.">
            <OptionGrid options={LIGHTING_STYLES} value={selections.lightingStyle} onChange={(lightingStyle) => updateSelection("lightingStyle", lightingStyle)} getDescription={(lightingStyle) => lightingDescriptions[lightingStyle]} />
          </StepShell>
        );
      case 9:
        return (
          <StepShell eyebrow="Advanced cricket" title="Fine tune action and stadium atmosphere" description="Optional professional controls for shot type, bowling action, celebration, crowd, and effects.">
            <div className="grid gap-8">
              <ControlGroup title="Batting Shot"><OptionGrid options={BATTING_SHOTS} value={selections.battingShot} onChange={(value) => updateSelection("battingShot", value)} /></ControlGroup>
              <ControlGroup title="Bowling Action"><OptionGrid options={BOWLING_ACTIONS} value={selections.bowlingAction} onChange={(value) => updateSelection("bowlingAction", value)} /></ControlGroup>
              <ControlGroup title="Celebration"><OptionGrid options={CELEBRATION_STYLES} value={selections.celebrationStyle} onChange={(value) => updateSelection("celebrationStyle", value)} /></ControlGroup>
              <ControlGroup title="Crowd Level"><OptionGrid options={STADIUM_CROWD_LEVELS} value={selections.crowdLevel} onChange={(value) => updateSelection("crowdLevel", value)} columns="two" /></ControlGroup>
              <ControlGroup title="Stadium Effect"><OptionGrid options={STADIUM_EFFECTS} value={selections.stadiumEffect} onChange={(value) => updateSelection("stadiumEffect", value)} columns="two" /></ControlGroup>
            </div>
          </StepShell>
        );
      case 10:
        return (
          <StepShell eyebrow="Jersey customization" title="Customize the professional cricket kit" description="Optional jersey controls are merged into the quality prompt without storing separate assets.">
            <div className="grid gap-5 md:grid-cols-2">
              <TextField label="Player Name" value={selections.playerName ?? ""} onChange={(value) => updateSelection("playerName", value)} placeholder="e.g. VIRAT" />
              <TextField label="Jersey Number" value={selections.jerseyNumber ?? ""} onChange={(value) => updateSelection("jerseyNumber", value)} placeholder="e.g. 18" />
              <ControlGroup title="Sleeve Style"><OptionGrid options={SLEEVE_STYLES} value={selections.sleeveStyle} onChange={(value) => updateSelection("sleeveStyle", value)} columns="two" /></ControlGroup>
              <ControlGroup title="Fit Style"><OptionGrid options={FIT_STYLES} value={selections.fitStyle} onChange={(value) => updateSelection("fitStyle", value)} columns="two" /></ControlGroup>
              <CheckField label="Captain Badge" checked={Boolean(selections.captainBadge)} onChange={(checked) => updateSelection("captainBadge", checked)} />
              <CheckField label="Vice-Captain Badge" checked={Boolean(selections.viceCaptainBadge)} onChange={(checked) => updateSelection("viceCaptainBadge", checked)} />
              <CheckField label="Official Team Colors" checked={Boolean(selections.officialTeamColors)} onChange={(checked) => updateSelection("officialTeamColors", checked)} />
            </div>
          </StepShell>
        );
      case 11:
        return (
          <StepShell eyebrow="Optimization engine" title="Choose output and prompt optimization" description="These controls optimize the prompt for provider, aspect ratio, quality, resolution, and export target.">
            <div className="grid gap-8">
              <ControlGroup title="Prompt Preset"><OptionGrid options={PROMPT_PRESETS} value={selections.promptPreset} onChange={(value) => updateSelection("promptPreset", value)} /></ControlGroup>
              <ControlGroup title="Aspect Ratio"><OptionGrid options={ASPECT_RATIOS} value={selections.aspectRatio} onChange={(value) => updateSelection("aspectRatio", value)} columns="two" /></ControlGroup>
              <ControlGroup title="Quality"><OptionGrid options={QUALITY_LEVELS} value={selections.qualityLevel} onChange={(value) => updateSelection("qualityLevel", value)} columns="two" /></ControlGroup>
              <ControlGroup title="Target Resolution"><OptionGrid options={TARGET_RESOLUTIONS} value={selections.targetResolution} onChange={(value) => updateSelection("targetResolution", value)} columns="two" /></ControlGroup>
              <ControlGroup title="Export Target"><OptionGrid options={EXPORT_TARGETS} value={selections.exportTarget} onChange={(value) => updateSelection("exportTarget", value)} /></ControlGroup>
            </div>
          </StepShell>
        );
      case 12:
        return (
          <StepShell eyebrow="Review" title="Confirm your studio setup" description="Review the uploaded image and all professional cricket controls before generation.">
            <ReviewChoices image={uploadedImage} selections={selections} onEditStep={goToStep} />
          </StepShell>
        );
      case 13:
        return (
          <StepShell eyebrow="AI studio workflow" title="Generate your professional cricket image" description="The server analyzes the image, optimizes a versioned prompt, queues generation, retries failures, scores quality, and saves history.">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ready for professional generation</CardTitle>
                  <CardDescription>Phase 6 adds prompt presets, advanced cricket controls, jersey details, stadium atmosphere, export targeting, optimization, queueing, and retry logic.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="grid gap-2">
                      <label htmlFor="project" className="text-sm font-semibold text-foreground">Save to project</label>
                      <select id="project" value={selectedProjectId} onChange={(event) => setSelectedProjectId(event.target.value)} className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25">
                        {projects.map((project) => <option key={project.id} value={project.id} className="bg-card text-foreground">{project.name}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input value={newProjectName} onChange={(event) => setNewProjectName(event.target.value)} placeholder="New project name" className="h-12 min-w-0 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25" />
                      <Button type="button" variant="outline" onClick={createProjectFromWizard} disabled={isCreatingProject || !newProjectName.trim()}><FolderPlus aria-hidden="true" /> Create</Button>
                    </div>
                  </div>
                  <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <label htmlFor="variation-count" className="text-sm font-semibold text-foreground">Creative variations</label>
                      <p className="mt-1 text-sm text-muted-foreground">The AI Creative Director will generate and rank multiple concepts.</p>
                    </div>
                    <select
                      id="variation-count"
                      value={variationCount}
                      onChange={(event) => setVariationCount(Number(event.target.value))}
                      className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
                    >
                      <option value={2} className="bg-card text-foreground">2 variations</option>
                      <option value={4} className="bg-card text-foreground">4 variations</option>
                      <option value={6} className="bg-card text-foreground">6 variations</option>
                      <option value={8} className="bg-card text-foreground">8 variations</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-7 text-muted-foreground">The result is saved to history with original image, generated image, prompt, settings, provider, timestamp, and quality score.</p>
                    <Button type="button" size="lg" onClick={() => runAiWorkflow()} disabled={!uploadedImage || !isSelectionComplete(selections) || !selectedProjectId || isProcessing}>
                      <Sparkles aria-hidden="true" /> {generationResult ? "Regenerate Concepts" : "Generate Cricket Concepts"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {errorMessage ? <div className="flex items-start gap-3 rounded-3xl border border-destructive/35 bg-destructive/10 p-4 text-sm text-destructive-foreground"><AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" /><p>{errorMessage}</p></div> : null}
              {isProcessing ? <AiProcessingProgress currentStage={processingStage} /> : null}
              {generationResult && uploadedImage ? (
                <AiGenerationResult
                  originalImage={uploadedImage}
                  result={generationResult}
                  selections={selections}
                  onGenerateVariation={runAiWorkflow}
                  onApplyRecommendation={(patch) => {
                    setSelections((current) => ({ ...current, ...patch }));
                    setGenerationResult(null);
                    setCurrentStep(12);
                  }}
                  isGeneratingAnother={isProcessing}
                />
              ) : null}
            </div>
          </StepShell>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full gap-5">
      <StudioSidebar projects={projects} />

      <section className="min-w-0 flex-1">
        <div className="grid gap-6">
          <StudioToolbar
            title="Professional Cricket AI Studio"
            description="Upload, preview, configure, optimize and generate cricket images from one premium workspace."
            status={isProcessing ? "Rendering" : generationResult ? "Result ready" : "Ready"}
          />
          <WizardProgress steps={wizardSteps} currentStep={currentStep} />
          <div key={currentStep} className="wizard-step-panel">{renderStep()}</div>
          <div className="flex flex-col justify-between gap-3 rounded-3xl border border-white/10 bg-card/65 p-4 backdrop-blur-xl sm:flex-row sm:items-center">
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={goPrevious} disabled={currentStep === 0 || isProcessing}><ArrowLeft aria-hidden="true" /> Previous</Button>
              {currentStep < wizardSteps.length - 1 ? <Button type="button" onClick={goNext} disabled={!canProceed || isProcessing}>Next <ArrowRight aria-hidden="true" /></Button> : null}
            </div>
            <Button type="button" variant="ghost" onClick={resetWorkflow} disabled={isProcessing}><RefreshCw aria-hidden="true" /> Reset workflow</Button>
          </div>
        </div>
      </section>

      <SettingsPanel selections={selections} isProcessing={isProcessing} />
    </div>
  );
}

interface StepShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

function StepShell({ eyebrow, title, description, children }: StepShellProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-white/[0.03]">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
        <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
        <CardDescription className="max-w-3xl text-sm sm:text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">{children}</CardContent>
    </Card>
  );
}

function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-black uppercase tracking-[0.22em] text-primary">{title}</h3>
      {children}
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-12 rounded-2xl border border-input bg-white/[0.04] px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25" />
    </label>
  );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-foreground">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-primary" />
      {label}
    </label>
  );
}
