import { m } from '@/paraglide/messages.js';
import {
  FigureStudioWorkspace,
  type FigureStudioCopy,
  type FigureStudioTemplate,
} from '@/components/figure-studio/workspace';

export function FigureStudio() {
  const copy: FigureStudioCopy = {
    eyebrow: m['figure_studio.eyebrow'](),
    title: m['figure_studio.title'](),
    subtitle: m['figure_studio.subtitle'](),
    illustration: m['figure_studio.modes.illustration'](),
    flowchart: m['figure_studio.modes.flowchart'](),
    plot: m['figure_studio.modes.plot'](),
    beta: m['figure_studio.modes.beta'](),
    comingSoon: m['figure_studio.modes.coming_soon'](),
    enhance: m['figure_studio.inputs.enhance'](),
    sketch: m['figure_studio.inputs.sketch'](),
    addReference: m['figure_studio.inputs.reference'](),
    promptPlaceholder: m['figure_studio.prompt.create_placeholder'](),
    enhancePlaceholder: m['figure_studio.prompt.enhance_placeholder'](),
    sketchPlaceholder: m['figure_studio.prompt.sketch_placeholder'](),
    referencePlaceholder: m['figure_studio.prompt.reference_placeholder'](),
    attach: m['figure_studio.references.attach'](),
    removeReference: (name) => m['figure_studio.references.remove']({ name }),
    style: m['figure_studio.settings.style'](),
    flat: m['figure_studio.settings.flat'](),
    detailed: m['figure_studio.settings.detailed'](),
    aspect: m['figure_studio.settings.aspect'](),
    resolution: m['figure_studio.settings.resolution'](),
    quality: m['figure_studio.settings.quality'](),
    model: m['figure_studio.settings.model'](),
    generate: m['figure_studio.actions.generate'](),
    generating: m['figure_studio.actions.generating'](),
    signInNotice: m['figure_studio.auth.notice'](),
    signIn: m['figure_studio.auth.sign_in'](),
    templates: m['figure_studio.templates.title'](),
    templateHint: m['figure_studio.templates.hint'](),
    promptApplied: m['figure_studio.feedback.prompt_applied'](),
    recent: m['figure_studio.recent.title'](),
    recentEmpty: m['figure_studio.recent.empty'](),
    working: m['figure_studio.status.working'](),
    elapsed: m['figure_studio.status.elapsed'](),
    download: m['figure_studio.actions.download'](),
    retry: m['figure_studio.actions.retry'](),
    useAsReference: m['figure_studio.actions.use_as_reference'](),
    referenceUploaded: (count) =>
      m['figure_studio.feedback.reference_uploaded']({ count }),
    referenceUnavailable: m['figure_studio.feedback.reference_unavailable'](),
    referenceUnsupported: m['figure_studio.feedback.reference_unsupported'](),
    referenceTooLarge: m['figure_studio.feedback.reference_too_large'](),
    referenceLimit: m['figure_studio.feedback.reference_limit'](),
    storagePublicRequired:
      m['figure_studio.feedback.storage_public_required'](),
    uploadFailed: m['figure_studio.feedback.upload_failed'](),
    generated: m['figure_studio.feedback.generated'](),
    projects: m['figure_studio.projects.title'](),
    projectHint: m['figure_studio.projects.hint'](),
    projectNew: m['figure_studio.projects.new'](),
    projectEmpty: m['figure_studio.projects.empty'](),
    projectOpened: m['figure_studio.projects.opened'](),
    projectDraft: m['figure_studio.projects.draft'](),
  };

  const templates: FigureStudioTemplate[] = [
    {
      id: 'cellular-architecture',
      title: m['figure_studio.templates.cell.title'](),
      description: m['figure_studio.templates.cell.description'](),
      image: '/imgs/generated/cellular-architecture.png',
      aspect: '4:3',
      quality: 'medium',
      style: 'flat',
      prompt: m['figure_studio.templates.cell.prompt'](),
    },
    {
      id: 'signaling-cascade',
      title: m['figure_studio.templates.signal.title'](),
      description: m['figure_studio.templates.signal.description'](),
      image: '/imgs/generated/signaling-cascade.png',
      aspect: '16:9',
      quality: 'medium',
      style: 'flat',
      prompt: m['figure_studio.templates.signal.prompt'](),
    },
    {
      id: 'rna-delivery',
      title: m['figure_studio.templates.rna.title'](),
      description: m['figure_studio.templates.rna.description'](),
      image: '/imgs/generated/rna-therapeutic-delivery.png',
      aspect: '16:9',
      quality: 'high',
      style: 'detailed',
      prompt: m['figure_studio.templates.rna.prompt'](),
    },
  ];

  return (
    <FigureStudioWorkspace
      copy={copy}
      templates={templates}
      signInHref="/sign-in"
    />
  );
}
