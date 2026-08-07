# /generate page spec — faithful clone of figpad.ai/generate-figure

## Overview

- **Target file:** `src/routes/generate.tsx`
- **Reference URL:** https://figpad.ai/generate-figure
- **Screenshot:** `docs/design-references/figpad-generate-figure-desktop.png`
- **Interaction model:** Static layout + click-driven (sidebar nav, top tabs, top buttons, generator controls, FAQ accordion, example prompt fill).

## Layout (verified via DOM walk)

### Top-level: two-column flex

```
<aside w-320 bg-#F7F7F7>  <main flex-1>
  sidebar nav              section.rounded bg-card
                            └─ top control row
                            └─ page hero (eyebrow + H1 + subtitle)
                            └─ generator panel (2 cols: form + preview)
                            └─ example prompts (2x2)
                            └─ how-to (4 steps)
                            └─ features (2-col grid)
                            └─ FAQ (accordion)
                          </section>
</aside>
```

## Sidebar (left, w-320, bg-#F7F7F7)

1. **Logo:** S mark + "SciDrawer AI" text (replaces FigPad's logo)
2. **Nav items** (h-30, rounded-lg, px-3, w-296):
   - `Generate Figure` — ACTIVE (`bg-#ededed`, text-slate-900)
   - `Generate Poster` — inactive (text-#5f6774, hover bg-#ededed)
   - `SVG Converter` — inactive
   - `SVG Editor` — inactive
3. **History** button (h-30, text-12px, text-#5f6774)
4. **Sign In** button (h-48, full-width, w-296, "Free" badge in upper-right)

## Top control row (inside main section)

- **Tab pills** (left, h-32, font-11px, rounded-full, gap-1, p-1, bg-card):
  - By Text / By Sketch / By Img / SVG Editor
  - Active state: `bg-foreground text-background`
  - Inactive: `text-muted-foreground hover:text-foreground`
- **Action buttons** (right, gap-2):
  - `+ New Dialogue` (h-44, bg-#415365, text-white, rounded-14px, px-4, font-14px, Plus icon)
  - `New` (h-44, outline, rounded-14px, px-4, font-14px)
  - `Paper to Poster` (h-44, outline, rounded-full, px-4, font-14px) + `Try Beta` badge (10px, bg-foreground text-background)

## Page hero (centered, py-12)

- Eyebrow: "Generate Figure" (uppercase, tracking-25em, text-primary, text-xs)
- H1: "AI Scientific Figure Generator" (font-serif, font-semibold, text-4xl sm:text-5xl)
- Subheadline: "Use SciDrawer AI as a scientific diagram maker for research visuals you can edit, vectorize, and export."

## Generator panel (grid: 1.05fr_1fr, gap-6)

### Left column (form)

- "Add reference sketches or images" button (h-44, full-width, rounded-full, ImagePlus icon)
- Textarea (rows-6, rounded-2xl, placeholder "Describe the figure you want to generate…")
- Bottom row (flex justify-between):
  - Left: aspect ratio pill (`1:1`, h-32, rounded-full) + model pill (`Flux Schnell`, h-36, Settings2 icon)
  - Right: round Send icon button (size-10, rounded-full, bg-slate-700, Send icon)

### Right column (preview pane)

- idle: dashed border, "Your generated figure will appear here."
- generating: muted bg, "Generating…"
- done: inline SVG placeholder (rounded-2xl, bg-muted)

## Example prompts (max-w-2xl, grid-cols-2, gap-2)

4 cards (h-auto, rounded-14px, border, px-4 py-3, font-14px):

1. LNP mRNA delivery graphical abstract
2. Leaf cross-section with vascular bundles
3. Protein interaction network with modular hubs
4. Microservice topology with async messaging
   Click → fills textarea with "Create a scientific figure about: <title>"

## How to Create (grid-cols-4, gap-6)

4 numbered steps, each rendered as:

- Small uppercase number (11px, text-muted-foreground)
- Title (20px, font-medium, tracking-0.96px)
- Description (14px, text-muted-foreground)

| #   | Title    | Description                                                                                                         |
| --- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | Choose   | Pick how you want to create your scientific figure — text prompt, rough sketch, or reference image to guide the AI. |
| 2   | Describe | Add details such as the research topic, biological pathway, molecular mechanism, or experimental workflow.          |
| 3   | Generate | SciDrawer AI produces a scientific illustration you can refine, restyle, and adapt to your manuscript.              |
| 4   | Export   | Review the figure, adjust labels, and export as PNG, SVG, or PPTX for papers, posters, and presentations.           |

## Features (grid-cols-2, gap-6)

H2: "AI Diagram Generator, Editor, and Vectorizer"
Subtitle: "Use SciDrawer AI to generate scientific figures, edit labels, convert PNG to SVG, and turn images into editable vectors in one workspace."
4 feature blocks:

1. Generate Scientific Diagrams
2. Edit Scientific Figure Text Online
3. Image to SVG converter
4. Export your figures in the format you need

## FAQ (Accordion, single collapsible)

H2: "AI Scientific Figure Generator FAQ"
6 Q&A items (verbatim from figpad):

1. **What image formats can I export?**
   You can export raster images such as PNG or JPG for quick use in manuscripts and slides, download SVG for editable vector work, and use PPTX export when you need a presentation-ready file.
2. **Can I use SciDrawer AI for free?**
   Yes. You can start for free and use SciDrawer AI as an AI figure generator or scientific diagram maker before upgrading for more credits, exports, or higher-volume workflows.
3. **What images can I upload?**
   You can upload PNG, JPG, and WebP reference images, sketches, screenshots, existing diagrams, and simple illustrations.
4. **Do I own copyright and can I use the images for journal publications?**
   Under the SciDrawer AI Terms, you keep ownership of your content and, to the maximum extent permitted by law, own the outputs generated for you. You are responsible for verifying scientific accuracy before publication.
5. **Is SciDrawer AI the best AI diagram generator for science figures?**
   SciDrawer AI is built for researchers who need more than a generic AI diagram generator — it combines an AI scientific figure generator, flow diagram generator, science diagram maker, SVG conversion, and editing tools in one workspace.
6. **Is my research data secure?**
   SciDrawer AI is designed for private research workflows — your prompts, uploads, and generated figures stay in your workspace unless you choose to share them. Do not upload confidential or regulated research data unless your institution allows it.

## States & behaviors

### Top tab pills (By Text / By Sketch / By Img / SVG Editor)

- **Click:** switches activeMode (UI-only; no input-mode swap)

### Sidebar nav

- **Click Generate Figure / Poster / SVG Converter / SVG Editor:** UI switches activePage; current page renders the same content (UI-only nav)

### Top buttons (+ New Dialogue / New / Paper to Poster)

- **Click:** no-op (placeholder for future wiring)

### Reference upload button

- **Click:** no-op (UI placeholder)

### Aspect / Model pills

- **Click:** no-op (UI placeholder; show selected value)

### Generate Send button

- **Disabled** when prompt.length < 3 or status === 'generating'
- **Click:** setStatus('generating'), 2.4s timeout → setStatus('done')

### Example prompt card

- **Click:** fills textarea with "Create a scientific figure about: <title>"

### FAQ

- **Click item:** toggles open/closed (single-open via type="single" collapsible)

## Responsive

- Sidebar: hidden on mobile (`hidden md:flex`), main takes full width
- Generator panel: 1-col on mobile, 2-col on lg+
- How-to / Features: stack to 1-col on mobile, grid on sm+

## Out of scope

- No real backend, no API calls, no AI generation — pure UI mock
- No i18n keys — copy hardcoded English (SciDrawer-branded)
- No asset downloads from figpad — all placeholders / inline SVG
- No worktree agents — built inline as a single route file
