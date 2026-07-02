# Cricket AI Studio

Professional multi-user cricket AI image studio built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui-style primitives, NextAuth, Prisma, PostgreSQL, and modular AI services.

## Current Scope: Phase 8.3 — AI Creative Director

Phase 8.3 transforms the generation experience into an AI Creative Director. Instead of producing one image only, the system now creates multiple professional creative concepts, evaluates them, ranks them, recommends the best image, and guides the user toward iterative improvements.

Existing authentication, projects, history, recommendation, prompt pipeline, AI generation, and quality engine functionality are preserved.

## Creative Director Workflow

```text
User clicks Generate
→ Image analysis runs
→ Intelligent prompt pipeline builds optimized base prompt
→ Creative Strategy Engine chooses multiple concepts
→ Multi Generation Engine generates variations concurrently
→ Ranking Engine scores each generated version
→ Feedback Engine explains strengths, weaknesses, and improvements
→ Timeline Engine creates generation timeline
→ Best Image Recommendation highlights strongest result
→ Every version is saved to project history
```

Default variation count is 4. The UI allows 2, 4, 6, or 8 variations.

## Creative Strategies

The strategy engine can choose from:

- Sports Broadcast
- Sports Documentary
- ESPN Style
- ICC Promotional
- IPL Promotional
- Movie Poster
- Sports Magazine
- Player Portrait
- Victory Celebration
- Training Session
- Locker Room
- Press Conference
- Stadium Entrance
- Net Practice

Each selected strategy includes a reason explaining why it fits the uploaded image and settings.

## New Architecture

```text
services/
├── comparison-engine/
│   └── comparison-engine.ts
├── creative-director/
│   ├── creative-director.ts
│   └── index.ts
├── creative-strategies/
│   └── creative-strategy-engine.ts
├── feedback-engine/
│   └── feedback-engine.ts
├── generation-insights/
│   └── generation-insights-engine.ts
├── generation-ranking/
│   └── generation-ranking-engine.ts
├── improvement-engine/
│   └── improvement-engine.ts
├── timeline-engine/
│   └── timeline-engine.ts
└── ...existing services

components/
└── creative-director/
    └── creative-director-panel.tsx

types/
└── creative-director.ts
```

## New Modules Explained

### `CreativeDirector`

Coordinates strategy planning, prompt variation creation, version assembly, ranking, timeline, insights, and best-image recommendation.

### `CreativeStrategyEngine`

Selects the best creative concepts for the uploaded image and user settings. Examples include Broadcast Match, Cinematic Hero, World Cup Poster, Magazine Cover, IPL Promotional, Victory Celebration, Training Session, and Stadium Entrance.

### `GenerationRankingEngine`

Scores every generated image across:

- Identity Preservation
- Cricket Accuracy
- Lighting
- Composition
- Facial Quality
- Background Quality
- Overall Realism
- Sports Photography Style
- Overall Score

### `FeedbackEngine`

Explains each generated image using:

- Strengths
- Weaknesses
- Suggestions
- Estimated improvement potential
- Quality prediction

### `ImprovementEngine`

Generates one-click suggestions:

- Improve Face
- Improve Lighting
- Improve Crowd/Stadium
- Improve Camera Angle
- Improve Pose
- Improve Jersey
- Improve Skin Detail/Realism
- Improve Cinematic Style

### `TimelineEngine`

Creates a generation timeline:

- Generation 1
- Generation 2
- Generation 3
- Generation 4+

Each timeline item includes strategy, rank, score, timestamp, and image.

### `ComparisonEngine`

Reusable service for comparing any two generations by score and summary.

### `GenerationInsightsEngine`

Summarizes generation metadata:

- Generation time
- Provider used
- Prompt version
- Optimization version
- Recommendation score
- Creative strategy summary

### `CreativeDirectorPanel`

Professional result UI showing:

- Ranked generated images
- Recommended image
- Strengths and weaknesses
- Improvement suggestions
- Smart shortcuts
- Timeline comparison
- Gallery management actions

## Ranking Algorithm

Each variation receives deterministic ranking scores based on:

```text
Prompt quality prediction
+ image analysis signals
+ selected creative strategy
+ cricket accuracy cues
+ lighting/camera/composition cues
```

The final score averages:

- Identity Preservation
- Cricket Accuracy
- Lighting
- Composition
- Facial Quality
- Background Quality
- Overall Realism
- Sports Photography Style

The highest ranked version is marked as the recommended image.

## Improvement Engine

The improvement engine checks the score profile for weaknesses.

Examples:

- Low facial quality → Improve Face
- Low lighting → Improve Lighting
- Low stadium/background score → Improve Stadium
- Low composition → Improve Camera Angle
- Low cricket accuracy → Improve Pose
- Low realism → Improve Realism

Each suggestion maps to an existing variation mode, so users can apply improvements with one click.

## UI Additions

After generation, the result view now includes:

- Ranked list of generated concepts
- Recommended Image badge
- Explanation of why it is best
- AI feedback panel
- Timeline and comparison selector
- Smart shortcuts:
  - Generate More Like This
  - Create Poster Version
  - Create Wallpaper Version
  - Create Social Media Version
  - Create World Cup Version
  - Create IPL Final Version
  - Create Training Version

## Backward Compatibility

The API still returns the previous single-image fields:

- `generatedImage`
- `prompt`
- `qualityScore`
- `promptVersion`
- `savedImageId`

It now also returns:

- `creativeDirector`

The top-level image is the best-ranked recommended image, preserving existing UI compatibility.

## Verification

Successfully verified:

```bash
npm run type-check
npm run lint
npm run test:coverage
npm run build
```

Results:

```text
6 test files passed
12 tests passed
Production build succeeded
Zero TypeScript errors
```

## Phase Boundary

Phase 8.3 does not implement:

- Payments
- Subscriptions
- Credits
- Chatbot
- Image editing
- Video generation
- Advanced face preservation

Advanced face preservation should wait for Phase 9.1.
