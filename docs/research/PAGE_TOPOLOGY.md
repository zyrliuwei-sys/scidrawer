# Figure Studio — Page Topology

## Scope

`/figure-studio` is an additive, FigPad-inspired workspace. It does not
replace or modify `/generate`.

## P0 sections

1. **Mode switcher** — Illustration is active and backed by the existing
   async image-generation API. Flowchart and Plot are visibly scoped for
   later, dedicated implementations rather than being presented as fake
   editable tools.
2. **Input-path controls** — Enhance Figure, Sketch to Figure, and Add
   Reference Figure select an input intent and open the real reference-image
   upload control.
3. **Prompt workbench** — Prompt, uploaded reference thumbnails, model,
   style, aspect ratio, resolution, quality, and submit action.
4. **Generation session** — Real provider progress, elapsed time, result,
   download, prompt copy, regenerate, and use-result-as-reference controls.
5. **Starter templates** — A small, code-local library. Selecting a card
   fills the prompt and relevant settings; it never starts a hidden task.
6. **Recent output** — Existing completed `ai_task` image history, shown with
   its real creation time and available to restore into the workbench.

## Interaction model

The P0 workbench is click-driven. File upload is explicit, generation requires
an enabled submit action, and task state is provider-polling driven. There are
no scroll-dependent state transitions.

## Explicit non-goals for P0

- Editing generated pixels, flowchart nodes, or plot data.
- Named projects, durable conversation URLs, task versions, and project
  metadata. These need a new Studio persistence module and API instead of
  overloading the existing `ai_task` history.
