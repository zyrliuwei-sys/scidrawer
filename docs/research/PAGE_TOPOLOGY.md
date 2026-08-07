# Page Topology — figpad.ai/generate-figure (clone target)

## Global

- **URL:** https://figpad.ai/generate-figure
- **Title:** "AI Scientific Figure Generator | Figpad"
- **Body class:** `overflow-x-hidden`
- **Primary font:** "Source Serif 4", ui-serif, Georgia, serif (Google Fonts)
- **Viewport (sampled):** 924×843 (Chrome default; intended desktop is 1440)
- **Favicon:** `https://figpad.ai/favicon.png?v=2`
- **Stylesheet:** Next.js chunked CSS, no global stylesheet link we need to mirror
- **Inline SVGs:** 40 (mostly icons)
- **Images:** 11
- **Videos:** 4
- **Section count (DOM):** 6

## Sections (top → bottom)

| #   | Section name                         | Notes                                                                                                                                                                                                                   |
| --- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Top nav with tabs**                | "History", "Sign In (Free)" buttons + tab bar: "By Text" / "By Sketch" / "By Img" / "+ New Dialogue" / "New" / "Paper to Poster (Try Beta)"                                                                             |
| 2   | **Page hero + main generator panel** | H1 "AI Scientific Figure Generator", subheadline, big textarea, "Add reference sketches or images", aspect ratio (1:1) + model select (GPT Image 2) + Generate button. Visually wrapped at `padding: 32px 112px`        |
| 3   | **Example prompts**                  | H2 "Example prompts". 4 prompt cards: "LNP mRNA delivery graphical abstract", "Leaf cross-section with vascular bundles", "Protein interaction network with modular hubs", "Microservice topology with async messaging" |
| 4   | **Recommended for You**              | H2 "Recommended for You" — personalized grid; skip in clone (no backend)                                                                                                                                                |
| 5   | **How to Create (4 steps)**          | H2 "How to Create Scientific Figures with FigPad". Cards: 1Choose / 2Describe / 3Generate / 4Export. Padding: 80px 0px 56px                                                                                             |
| 6   | **AI Scientific Figure Generator**   | Feature grid covers text-to-image, sketch-to-figure, reference-image guidance, and original image download. Padding: 64px 0px                                                                                           |
| 7   | **FAQ**                              | H2 "AI Scientific Figure Generator FAQ". 6 Q&A accordion items                                                                                                                                                          |
| 8   | **Footer**                           | Standard footer                                                                                                                                                                                                         |

## Interaction model

- Static content + scroll. No scroll-driven animations detected on initial load.
- Tab bar at top is click-driven (switches between "By Text" / "By Sketch" / "By Img").
- FAQ is click-driven accordion.

## Color palette (sampled)

- Background: `rgb(255, 255, 255)`
- Subtle bg / muted: `rgb(237, 237, 238)`
- Dark text: `rgb(15, 23, 44)`, `rgb(30, 38, 47)`, `lab(1.77 1.33 -9.29)` ≈ near-black
- Muted text: `rgb(95, 103, 116)`, `rgb(139, 139, 139)`
- Mid: `rgb(65, 83, 101)`
- White text: `rgb(255, 255, 255)`

## Typography

- H1 uses Source Serif 4 — serif
- Buttons / labels / body likely sans-serif (need to verify)
