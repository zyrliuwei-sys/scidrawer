# FigureStudioWorkspace Specification

## Overview

- **Target file:** `src/components/figure-studio/workspace.tsx`
- **Route:** `/figure-studio`
- **Interaction model:** click-driven inputs plus provider-polling task state
- **Reference:** user-supplied FigPad workbench captures; exact target-site
  DOM extraction was unavailable because the remote page's rendering layer did
  not respond to browser inspection.

## Functional contract

- Use only `@/lib/api-client` for client API calls.
- Use `POST /api/storage/upload-image?purpose=reference` for image uploads.
- Use `POST /api/ai/images` to create a task and `GET /api/ai/images/$id` to
  poll it at 1.2 second intervals.
- Preserve `/generate`: no imports from, mutations to, or routing changes in
  that page.
- Display real task status/progress/elapsed time. Do not invent completion.
- A template/card click only applies its values to the editable workbench.

## Layout

- Centered desktop workspace with a compact three-option mode strip.
- Three input-path buttons precede a single bordered prompt card.
- The prompt card contains uploaded reference thumbnails, a multiline
  textarea, compact setting controls, and one high-emphasis generation button.
- Under the prompt card, show starter templates and a compact recent-output
  list. On small screens all grids stack to one column.

## States & behaviours

### Input intent

- **Trigger:** Click Enhance Figure, Sketch to Figure, or Add Reference
  Figure.
- **Effect:** Marks the active intent, changes the prompt placeholder, and
  opens the real upload input. It does not remove already uploaded references.

### Generation

- **Trigger:** Signed-in user submits a valid prompt.
- **Effect:** Creates an async task, disables editing controls, polls progress,
  and shows task elapsed time.
- **Terminal state:** success exposes provider result via the authenticated
  preview endpoint; failure shows a retryable message.

### Template

- **Trigger:** Click a template card.
- **Effect:** Fills prompt, style, aspect ratio, and quality, then focuses the
  prompt textarea. No task starts until the user selects Generate.

## Responsive behaviour

- **Desktop:** three mode buttons and three template cards in a row.
- **Tablet:** settings wrap within the prompt footer; templates remain two or
  three columns where possible.
- **Mobile:** mode and input-path controls wrap, template cards stack, and
  recent output becomes a single-column list.
