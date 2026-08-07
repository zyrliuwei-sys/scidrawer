# Behaviors — figpad.ai/generate-figure

## Scroll behavior

- Body class: `overflow-x-hidden`
- No scroll-driven animations detected on initial load (static sections).
- No smooth-scroll library active (default browser scroll).

## Interaction model

- **Top nav tabs** ("By Text" / "By Sketch" / "By Img" / "SVG Editor"): click-driven — switches input mode. NOT scroll-driven.
- **"+ New Dialogue"**: click-driven — starts fresh conversation.
- **Aspect ratio selector** (1:1): click-driven — switches dropdown.
- **Model selector** ("GPT Image 2"): click-driven — opens dropdown.
- **Generate button**: click-driven — submits prompt (would call backend in real site; we'll mock).
- **Example prompt cards**: click-driven — fills the textarea with that prompt.
- **FAQ items**: click-driven accordion — single-open behavior likely.
- **All other sections** (How-to steps, Features grid): static.

## Hover states (observed on buttons)

- Main CTA buttons transition backgroundColor slightly (from solid to slightly darker).
- Card backgrounds may shift on hover (TBD — needs interaction).
- Tabs likely get a subtle bg change on hover.

## Static properties (CSS)

- **Body font:** "Source Serif 4", ui-serif, Georgia, serif — 16px, weight 500
- **H1:** Source Serif 4 — 36px, weight 600
- **H2:** Source Serif 4 — 16px, weight 400 (small section labels)
- **H3:** Source Serif 4 — 24px, weight 500, letter-spacing 0.96px
- **Button text:** white `rgb(255, 255, 255)`
- **Main CTA bg:** `rgb(65, 83, 101)` dark slate
- **Card bg:** `rgb(255, 255, 255)` with 14px border-radius
- **Pill buttons** (1:1, GPT Image 2): white bg, dark text, fully rounded

## Responsive behavior

- Desktop viewport: 1440px (intended); sampled at 924px (Chrome default)
- Site uses max-width container at `112px` horizontal padding on hero (so inner width = 1280px on 1440 viewport)
- Mobile (390px) not yet captured — assume grid stacks to single column
