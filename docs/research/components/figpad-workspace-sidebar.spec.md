# FigPad Workspace Sidebar Specification

## Overview

- **Reference:** `https://figpad.ai/svg-converter`
- **Target file:** `src/components/generator/figpad-workspace-sidebar.tsx`
- **Interaction model:** click-driven navigation, collapsible history disclosure, and a click-driven compact/expanded sidebar.
- **Evidence:** The target browser session did not return a readable DOM during this inspection. Structure, text, Tailwind utility classes, routes, and interaction affordances below were extracted from the target page's server-rendered HTML. Values explicitly shown in those classes are used verbatim; do not invent extra visual treatments.

## DOM Structure

```text
aside (desktop only)
  header
    product wordmark + collapse control
  nav
    Generate Figure
    Generate Poster
    SVG Converter
    SVG Editor
  history section (takes remaining vertical space)
    History disclosure button + chevron
    generated-item rows / loading skeleton / empty state
  account footer
    avatar + user/sign-in label + Free-plan chip
```

## Target Tokens and Layout

- Desktop sidebar: `md:flex`, fixed left column, `w-[320px]`, full viewport height, `bg-[#F7F7F7]`.
- Inner padding: `px-3 py-4` (12px horizontal, 16px vertical).
- Navigation list: `grid gap-3`; each row `h-[30px]`, `rounded-lg`, `px-3`, `text-sm`, `font-semibold`.
- Navigation inactive text: `#525252`; hover background: translucent white (`hover:bg-white/75`).
- Selected navigation background: `#EDEDEE`; no heavy dark selected state.
- History separator: top border, `mt-5 pt-4`; header uses a chevron that rotates 90 degrees while expanded.
- Account separator: top border with generous footer padding; avatar is a 32px neutral circle and the plan chip reads `Free`.
- The product wordmark is `FigPad` in the reference. Use `SciDrawer` in the local clone to retain the product brand while preserving the reference layout.
- Icons: `Image`, `Presentation`, `FileCode2`, `PenTool`, `ChevronRight`, `PanelLeftClose`, `PanelLeftOpen`, and `CircleUserRound` (Lucide).

## States & Behaviors

### Navigation

- **Trigger:** click a row.
- **Rows and routes from source:**
  - `Generate Figure` → `/generate-figure`
  - `Generate Poster` → `/scientific-poster`
  - `SVG Converter` → `/svg-converter`
  - `SVG Editor` → `/svg-editor`
- **Local mapping:** use the local generating workspace for `Generate Figure`, local poster page for `Generate Poster`, and local converter/editor routes when supplied by the page. The active item has `#EDEDEE`; it must not navigate to a missing route.
- **Hover:** inactive row background changes to `rgba(255,255,255,.75)`; apply a restrained 150–200ms color transition.

### Sidebar collapse

- **Trigger:** click the panel control in the header.
- **Expanded:** 320px width and labels are visible.
- **Collapsed:** 64px width; retain icons, hide labels and account text, preserve accessible `aria-label` values and tooltips via `title`.
- **Transition:** target has no explicit transition found in SSR markup; use a 200ms width/opacity transition so the interaction remains calm and usable.

### History

- **Trigger:** click `History` header.
- **Expanded:** chevron rotates 90° and project/history rows are shown.
- **Collapsed:** only header is shown.
- **Rows:** if image history exists, show thumbnail, truncated prompt, and relative/project time. Clicking a row invokes the supplied selection callback. If loading, show 3 narrow skeleton rows; if empty, show a small `No figures yet` message. This replaces the target's generic loading skeleton with working local history.

### Account footer

- **Signed out:** label `Sign in`, plan chip `Free`; invokes supplied sign-in handler.
- **Signed in:** show first character of the available user name/email, display name/email, and plan chip `Free`; clicking uses supplied account handler.

## Responsive Behavior

- **Desktop (>=768px):** sidebar visible as a full-height left column.
- **Tablet/mobile (<768px):** sidebar hidden; existing mobile generator chrome remains responsible for access.

## Text Content (verbatim target labels)

`Generate Figure`, `Generate Poster`, `SVG Converter`, `SVG Editor`, `History`, `Sign In`, `Free`.
