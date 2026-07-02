export const CRICKET_FORMATS = [
  "IPL",
  "International",
  "World Cup",
  "Test",
  "ODI",
  "T20",
  "Street Cricket",
] as const;

export const IPL_TEAMS = ["RCB", "CSK", "MI", "KKR", "GT", "RR", "PBKS", "LSG", "DC", "SRH"] as const;

export const INTERNATIONAL_TEAMS = [
  "India",
  "Australia",
  "England",
  "Pakistan",
  "New Zealand",
  "South Africa",
  "Sri Lanka",
  "Bangladesh",
  "Afghanistan",
  "West Indies",
] as const;

export const PLAYER_ROLES = ["Batsman", "Bowler", "All-rounder", "Captain", "Wicket Keeper", "Coach"] as const;

export const CRICKET_POSES = [
  "Cover Drive",
  "Straight Drive",
  "Six Hit",
  "Pull Shot",
  "Fast Bowling",
  "Spin Bowling",
  "Appeal",
  "Celebration",
  "Walking into Stadium",
  "Holding Trophy",
  "Trophy Lift",
  "Press Conference",
  "Practice Nets",
] as const;

export const BATTING_SHOTS = [
  "Cover Drive",
  "Straight Drive",
  "Sweep",
  "Pull",
  "Hook",
  "Upper Cut",
  "Helicopter Shot",
  "Reverse Sweep",
] as const;

export const BOWLING_ACTIONS = [
  "Fast",
  "Swing",
  "Reverse Swing",
  "Yorker",
  "Bouncer",
  "Leg Spin",
  "Off Spin",
  "Doosra",
  "Googly",
] as const;

export const CELEBRATION_STYLES = [
  "Raise Bat",
  "Raise Helmet",
  "Roaring",
  "Trophy Lift",
  "Crowd Salute",
  "Team Huddle",
] as const;

export const STADIUMS = [
  "Wankhede Stadium",
  "Eden Gardens",
  "Narendra Modi Stadium",
  "M Chinnaswamy Stadium",
  "Lord's",
  "Melbourne Cricket Ground",
  "The Oval",
] as const;

export const MATCH_TIMES = ["Day Match", "Night Match", "Sunset Match", "Rain Match"] as const;

export const STADIUM_CROWD_LEVELS = ["Packed Crowd", "Half Crowd", "Empty Stadium"] as const;

export const STADIUM_EFFECTS = ["None", "Fog", "Fireworks", "Confetti", "Rain", "Golden Hour Glow"] as const;

export const CAMERA_STYLES = [
  "Broadcast Camera",
  "Telephoto Lens",
  "Close-up Portrait",
  "Action Camera",
  "Drone",
  "Ground Level",
  "Wide Stadium",
  "Slow Motion Style",
] as const;

export const LIGHTING_STYLES = [
  "Morning",
  "Golden Hour",
  "Afternoon",
  "Night Match",
  "Floodlights",
  "Rain Match",
  "Cloudy",
  "Sunset",
] as const;

export const SLEEVE_STYLES = ["Short Sleeve", "Long Sleeve", "Sleeveless Training", "Compression Inner"] as const;
export const FIT_STYLES = ["Athletic Fit", "Regular Fit", "Loose Match Fit", "Slim Fit"] as const;
export const ASPECT_RATIOS = ["1:1", "3:4", "4:5", "16:9", "9:16", "21:9"] as const;
export const QUALITY_LEVELS = ["Standard", "High", "Ultra"] as const;
export const TARGET_RESOLUTIONS = ["HD", "4K", "8K"] as const;
export const EXPORT_TARGETS = [
  "Instagram Post",
  "Instagram Story",
  "Facebook Cover",
  "YouTube Thumbnail",
  "LinkedIn Banner",
  "Wallpaper",
  "Poster",
] as const;

export const PROMPT_PRESETS = [
  "Epic IPL",
  "World Cup Hero",
  "Legendary Captain",
  "Match Winner",
  "Training Session",
  "Press Conference",
  "Victory Celebration",
] as const;

export type CricketFormat = (typeof CRICKET_FORMATS)[number];
export type IplTeam = (typeof IPL_TEAMS)[number];
export type InternationalTeam = (typeof INTERNATIONAL_TEAMS)[number];
export type CricketTeam = IplTeam | InternationalTeam;
export type PlayerRole = (typeof PLAYER_ROLES)[number];
export type CricketPose = (typeof CRICKET_POSES)[number];
export type BattingShot = (typeof BATTING_SHOTS)[number];
export type BowlingAction = (typeof BOWLING_ACTIONS)[number];
export type CelebrationStyle = (typeof CELEBRATION_STYLES)[number];
export type Stadium = (typeof STADIUMS)[number];
export type MatchTime = (typeof MATCH_TIMES)[number];
export type StadiumCrowdLevel = (typeof STADIUM_CROWD_LEVELS)[number];
export type StadiumEffect = (typeof STADIUM_EFFECTS)[number];
export type CameraStyle = (typeof CAMERA_STYLES)[number];
export type LightingStyle = (typeof LIGHTING_STYLES)[number];
export type SleeveStyle = (typeof SLEEVE_STYLES)[number];
export type FitStyle = (typeof FIT_STYLES)[number];
export type AspectRatio = (typeof ASPECT_RATIOS)[number];
export type QualityLevel = (typeof QUALITY_LEVELS)[number];
export type TargetResolution = (typeof TARGET_RESOLUTIONS)[number];
export type ExportTarget = (typeof EXPORT_TARGETS)[number];
export type PromptPreset = (typeof PROMPT_PRESETS)[number];

export interface CricketSelections {
  format?: CricketFormat;
  team?: CricketTeam;
  role?: PlayerRole;
  pose?: CricketPose;
  battingShot?: BattingShot;
  bowlingAction?: BowlingAction;
  celebrationStyle?: CelebrationStyle;
  stadium?: Stadium;
  matchTime?: MatchTime;
  crowdLevel?: StadiumCrowdLevel;
  stadiumEffect?: StadiumEffect;
  cameraStyle?: CameraStyle;
  lightingStyle?: LightingStyle;
  playerName?: string;
  jerseyNumber?: string;
  captainBadge?: boolean;
  viceCaptainBadge?: boolean;
  sleeveStyle?: SleeveStyle;
  fitStyle?: FitStyle;
  officialTeamColors?: boolean;
  aspectRatio?: AspectRatio;
  qualityLevel?: QualityLevel;
  targetResolution?: TargetResolution;
  exportTarget?: ExportTarget;
  promptPreset?: PromptPreset;
}

/**
 * Team choices are contextual. IPL uses franchise teams; every other format
 * uses international sides so the wizard remains complete across cricket formats.
 */
export function getTeamOptions(format?: CricketFormat) {
  if (format === "IPL") return IPL_TEAMS;
  return INTERNATIONAL_TEAMS;
}

export function isSelectionComplete(selections: CricketSelections) {
  return Boolean(
    selections.format &&
      selections.team &&
      selections.role &&
      selections.pose &&
      selections.stadium &&
      selections.matchTime &&
      selections.cameraStyle &&
      selections.lightingStyle,
  );
}
