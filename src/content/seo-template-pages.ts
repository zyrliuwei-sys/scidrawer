import type { SeoLocale, SeoPageContent } from '@/content/seo-pages';

type LongTailSlug =
  | 'cell-membrane-diagram'
  | 'mitosis-diagram'
  | 'neuron-labeled';

const shared = {
  en: {
    home: 'Home',
    templates: 'Templates',
    faq: 'FAQ',
    try: 'Try SciDrawer',
    tryLabel: 'Open the AI figure generator',
    related: 'Related tools',
    relatedDescription:
      'Explore more focused research figure pages, browse editable templates, or open the generator for a custom draft.',
  },
  zh: {
    home: '首页',
    templates: '模板',
    faq: '常见问题',
    try: '试用 SciDrawer',
    tryLabel: '打开 AI 科研配图生成器',
    related: '相关工具',
    relatedDescription:
      '继续浏览具体科研图示页面，探索可编辑模板，或打开生成器制作自定义草稿。',
  },
} as const;

const cellMembraneEn: SeoPageContent = {
  locale: 'en',
  title:
    'Cell Membrane Diagram - Create Labeled Membrane Illustrations | SciDrawer',
  description:
    'Create a clear cell membrane diagram with labeled layers, transport proteins, receptors, and signaling events from a prompt, sketch, or reference image.',
  eyebrow: 'Cell biology template',
  h1: 'Cell Membrane Diagram',
  intro:
    'Build a labeled cell membrane diagram for teaching, research figures, pathway explanations, or a graphical abstract.',
  heroImage: '/imgs/showcase/microscopic-structures.svg',
  heroImageAlt: 'Cellular structure diagram showing membrane organization',
  breadcrumbHome: shared.en.home,
  breadcrumbLibrary: shared.en.templates,
  breadcrumbCurrent: 'Cell Membrane Diagram',
  ctaLabel: 'Create a membrane diagram',
  sections: [
    {
      heading: 'What a Cell Membrane Diagram Should Show',
      paragraphs: [
        'A useful cell membrane diagram makes the boundary of the cell easy to recognize and then explains what crosses it or interacts with it. Depending on the research question, the visual may include the phospholipid bilayer, membrane proteins, channels, transporters, receptors, extracellular ligands, cytoplasmic factors, or a signal moving toward the nucleus. The diagram does not need to show every molecule. It should show the parts that support the claim and use labels that match the terminology in the paper or lesson.',
        'Use a cross-section when the goal is to explain layers and transport. Use a pathway layout when the membrane is the starting point of a signaling cascade. A central membrane with outward callouts works well for a labeled educational figure. SciDrawer can help create a starting composition from a text prompt or sketch; check orientation, compartment names, and the direction of every arrow before using it in a formal figure.',
      ],
      links: [
        { label: 'Browse diagram templates', href: '/templates' },
        { label: 'Generate a custom diagram', href: '/generate' },
      ],
    },
    {
      heading: 'How to Make a Labeled Cell Membrane Diagram',
      paragraphs: [
        'Start by deciding whether the diagram explains structure, transport, receptor activation, or a comparison between membrane states. Name the compartments first, then list only the proteins and molecules needed for that explanation. Keep the bilayer visually stable so the reader can distinguish the extracellular and intracellular sides at a glance.',
      ],
      subsections: [
        {
          heading: 'Choose labels and compartments',
          paragraphs: [
            'Use short labels for membrane components and add a compact legend for repeated symbols. If the figure includes a receptor or transporter, state what it binds or moves. The [plant cell labeled example](/plant-cell-labeled) shows how a stable central structure and outward leader lines can keep many labels readable.',
          ],
        },
        {
          heading: 'Show the relationship, not just the object',
          paragraphs: [
            'A receptor becomes meaningful when the diagram shows ligand binding, conformational change, or a downstream signal. A channel becomes meaningful when an ion or molecule has a clear direction. Use arrows and annotations to explain the relationship, then remove decorative elements that compete with the process.',
          ],
        },
        {
          heading: 'Review and export',
          paragraphs: [
            'Compare the final labels with the manuscript or source material, test the diagram at the target display size, and export the format required by the journal or course. If the diagram becomes part of a paper-wide visual story, compare it with the [scientific diagram maker](/scientific-diagram-maker) and [graphical abstract maker](/graphical-abstract-maker) workflows.',
          ],
        },
      ],
    },
    {
      heading: 'Common Mistakes',
      paragraphs: [
        'Avoid mixing the two sides of the membrane without a clear compartment label. Do not draw arrows through the bilayer if the process is meant to stop at the membrane, and do not use color alone to distinguish extracellular from intracellular events. Labels should not cross the membrane or each other, and abbreviations should be explained when the figure is intended for a broad audience.',
      ],
      bullets: [
        'Keep the bilayer, membrane proteins, and compartments visually distinct.',
        'Use a consistent direction for transport and signaling arrows.',
        'Match labels and abbreviations to the terminology in the study.',
      ],
    },
  ],
  faqHeading: shared.en.faq,
  faq: [
    {
      question: 'Can I create a cell membrane diagram with labels?',
      answer:
        'Yes. Describe the bilayer, compartments, proteins, molecules, and labels you need, then review the generated structure for scientific accuracy.',
    },
    {
      question: 'Can I show transport or signaling?',
      answer:
        'Yes. Specify the direction, starting event, and outcome so the diagram explains a relationship rather than showing isolated objects.',
    },
    {
      question: 'Can I start from a sketch?',
      answer:
        'Yes. A sketch is useful for communicating the layout and the relative position of compartments or membrane components.',
    },
    {
      question: 'Is the diagram ready to publish without review?',
      answer:
        'No. Check every label, arrow, compartment, and biological claim against your manuscript or source material before publication.',
    },
    {
      question: 'Can I use it in a Chinese paper or class?',
      answer:
        'Yes. Replace the labels with the preferred Chinese terminology and check font support and readability for the final audience.',
    },
  ],
  tryHeading: shared.en.try,
  tryParagraph:
    'Describe the membrane structure or process you need, attach a sketch if useful, and create a scientific starting point with SciDrawer.',
  tryLabel: shared.en.tryLabel,
  relatedHeading: shared.en.related,
  relatedDescription: shared.en.relatedDescription,
  relatedLinks: [
    { label: 'Scientific Diagram Maker', href: '/scientific-diagram-maker' },
    { label: 'Plant Cell Labeled Diagram', href: '/plant-cell-labeled' },
    { label: 'AI Scientific Figure Generator', href: '/generate' },
  ],
};

const cellMembraneZh: SeoPageContent = {
  locale: 'zh',
  title: 'Cell Membrane Diagram - 创建细胞膜标注图 | SciDrawer',
  description:
    '通过提示词、草图或参考图创建细胞膜示意图，标注膜层、转运蛋白、受体和信号事件，适合论文、教学和图形摘要。',
  eyebrow: '细胞生物学模板',
  h1: 'Cell Membrane Diagram',
  intro: '制作带有膜层、蛋白、受体和信号关系的细胞膜示意图。',
  heroImage: '/imgs/showcase/microscopic-structures.svg',
  heroImageAlt: '展示细胞膜结构的科研示意图',
  breadcrumbHome: shared.zh.home,
  breadcrumbLibrary: shared.zh.templates,
  breadcrumbCurrent: 'Cell Membrane Diagram',
  ctaLabel: '创建细胞膜示意图',
  sections: [
    {
      heading: '细胞膜示意图应该展示什么？',
      paragraphs: [
        '一张有用的细胞膜示意图，首先要让读者认出细胞边界，再解释什么穿过边界或与边界发生作用。根据研究问题，可以加入磷脂双层、膜蛋白、通道、转运体、受体、细胞外配体、细胞质因子或向细胞核传递的信号。不必画出所有分子，应保留能支持核心结论的部分，并让标签与论文或课程中的术语一致。',
        '如果重点是层次和运输，可以使用剖面图；如果重点是膜受体启动的信号级联，可以使用通路结构；如果重点是识别组件，可以使用中心主体加外向引线的标注式布局。SciDrawer 可以根据提示词或草图制作构图起点，但正式使用前应检查方向、分区名称和每条箭头。',
      ],
      links: [
        { label: '浏览示意图模板', href: '/templates' },
        { label: '生成自定义图示', href: '/generate' },
      ],
    },
    {
      heading: '如何制作细胞膜标注图？',
      paragraphs: [
        '先确定图示是在解释结构、运输、受体激活，还是膜状态之间的比较。先命名空间分区，再列出解释问题所需的蛋白和分子。保持双层结构稳定，让读者能够一眼分辨细胞外侧和细胞内侧。',
      ],
      subsections: [
        {
          heading: '选择标签和分区',
          paragraphs: [
            '为膜组件使用短标签，重复符号可以放进小图例。如果包含受体或转运体，应说明它结合或移动的对象。[植物细胞标注图](/plant-cell-labeled) 展示了如何用稳定的中心主体和向外引线容纳多个标签。',
          ],
        },
        {
          heading: '表达关系，而不只是画对象',
          paragraphs: [
            '受体只有在图中表现出配体结合、构象变化或下游信号时才具有解释意义；通道也需要清楚表达离子或分子的方向。用箭头和简短注释说明关系，再删掉会干扰过程的装饰。',
          ],
        },
        {
          heading: '核对并导出',
          paragraphs: [
            '对照论文或源材料检查标签，在目标展示尺寸下测试可读性，并按期刊或课程要求导出。如果图示要成为整篇论文视觉故事的一部分，可以继续参考 [Scientific Diagram Maker](/scientific-diagram-maker) 和 [图形摘要制作工具](/graphical-abstract-maker)。',
          ],
        },
      ],
    },
    {
      heading: '常见错误',
      paragraphs: [
        '不要在没有清楚分区的情况下混淆细胞膜两侧，不要让不应穿过双层的箭头直接穿过膜，也不要只用颜色区别细胞外和细胞内事件。标注线不应穿过双层或彼此交叉，面向广泛读者时要解释缩写。',
      ],
      bullets: [
        '区分双层、膜蛋白和空间分区。',
        '统一运输和信号箭头方向。',
        '让标签与研究中的术语和缩写一致。',
      ],
    },
  ],
  faqHeading: shared.zh.faq,
  faq: [
    {
      question: '可以制作带标签的细胞膜示意图吗？',
      answer:
        '可以。描述双层、空间分区、蛋白、分子和需要的标签，生成后再检查科学准确性。',
    },
    {
      question: '可以表现运输或信号通路吗？',
      answer:
        '可以。写清方向、起始事件和结果，让图示表达关系，而不是只展示孤立对象。',
    },
    {
      question: '可以从草图开始吗？',
      answer: '可以。草图适合表达空间布局以及膜组件之间的相对位置。',
    },
    {
      question: '生成后可以不检查就发表吗？',
      answer:
        '不可以。发表前应根据论文或源材料检查标签、箭头、分区和生物学陈述。',
    },
    {
      question: '可以用于中文论文或课堂吗？',
      answer: '可以。替换为合适的中文术语，并检查字体支持和最终受众的可读性。',
    },
  ],
  tryHeading: shared.zh.try,
  tryParagraph:
    '描述需要的细胞膜结构或过程，必要时附上草图，用 SciDrawer 创建科研图示起点。',
  tryLabel: shared.zh.tryLabel,
  relatedHeading: shared.zh.related,
  relatedDescription: shared.zh.relatedDescription,
  relatedLinks: [
    { label: 'Scientific Diagram Maker', href: '/scientific-diagram-maker' },
    { label: '植物细胞标注图', href: '/plant-cell-labeled' },
    { label: 'AI 科研配图生成器', href: '/generate' },
  ],
};

function simpleLongTailPage(
  locale: SeoLocale,
  slug: LongTailSlug,
  labels: {
    title: string;
    description: string;
    h1: string;
    intro: string;
    current: string;
    heroImage: string;
    heroAlt: string;
    focus: string;
    focusText: string;
    stepsText: string;
    mistakesText: string;
    faq: SeoPageContent['faq'];
    relatedLabel: string;
  }
): SeoPageContent {
  const copy = shared[locale];
  return {
    locale,
    title: labels.title,
    description: labels.description,
    eyebrow: locale === 'zh' ? '科研图示模板' : 'Research figure template',
    h1: labels.h1,
    intro: labels.intro,
    heroImage: labels.heroImage,
    heroImageAlt: labels.heroAlt,
    breadcrumbHome: copy.home,
    breadcrumbLibrary: copy.templates,
    breadcrumbCurrent: labels.current,
    ctaLabel: locale === 'zh' ? '创建自定义图示' : 'Create a custom diagram',
    sections: [
      {
        heading: labels.focus,
        paragraphs: [labels.focusText],
        links: [
          {
            label: locale === 'zh' ? '浏览全部模板' : 'Browse all templates',
            href: '/templates',
          },
          {
            label: locale === 'zh' ? '打开 AI 生成器' : 'Open the AI generator',
            href: '/generate',
          },
        ],
      },
      {
        heading: locale === 'zh' ? '制作步骤' : 'How to make this figure',
        paragraphs: [labels.stepsText],
        subsections: [
          {
            heading:
              locale === 'zh'
                ? '确定主体和标签'
                : 'Define the subject and labels',
            paragraphs: [
              locale === 'zh'
                ? '先写出图示要支持的一句话结论，再列出必须出现的结构和术语。让中心主体保持稳定，使用短标签和一致的引线。'
                : 'Write the one-sentence claim first, then list the structures and terms that must appear. Keep the main subject stable and use short labels with consistent leader lines.',
            ],
          },
          {
            heading:
              locale === 'zh'
                ? '选择视觉关系'
                : 'Choose the visual relationship',
            paragraphs: [
              locale === 'zh'
                ? '连续变化适合流程式布局，组件识别适合标注式布局，条件差异适合对比式布局。需要时可以附上草图，再在 [Scientific Diagram Maker](/scientific-diagram-maker) 中继续探索。'
                : 'Use a flow layout for change over time, callouts for component identification, and comparison panels for conditions. Add a sketch when the composition matters, then explore variations in the [scientific diagram maker](/scientific-diagram-maker).',
            ],
          },
        ],
      },
      {
        heading: locale === 'zh' ? '常见错误' : 'Common mistakes',
        paragraphs: [labels.mistakesText],
        bullets: [
          locale === 'zh'
            ? '不要让装饰元素盖过结构和关系。'
            : 'Do not let decoration compete with structure and relationships.',
          locale === 'zh'
            ? '不要使用未经核对的标签或因果箭头。'
            : 'Do not use labels or causal arrows without checking the source.',
          locale === 'zh'
            ? '在最终展示尺寸下检查字号和对比度。'
            : 'Check type size and contrast at the final display size.',
        ],
      },
    ],
    faqHeading: copy.faq,
    faq: labels.faq,
    tryHeading: copy.try,
    tryParagraph:
      locale === 'zh'
        ? '从具体结构或过程开始，输入提示词、上传草图或参考图，用 SciDrawer 创建一个适合继续编辑的科研图示起点。'
        : 'Start with the structure or process you need, add a prompt, sketch, or reference image, and use SciDrawer to create a research figure starting point you can refine.',
    tryLabel: copy.tryLabel,
    relatedHeading: copy.related,
    relatedDescription: copy.relatedDescription,
    relatedLinks: [
      { label: labels.relatedLabel, href: `/${slug}` },
      {
        label:
          locale === 'zh' ? '科研示意图生成器' : 'Scientific Diagram Maker',
        href: '/scientific-diagram-maker',
      },
      {
        label:
          locale === 'zh' ? '图形摘要制作工具' : 'Graphical Abstract Maker',
        href: '/graphical-abstract-maker',
      },
    ],
  };
}

const templatePages: Record<LongTailSlug, Record<SeoLocale, SeoPageContent>> = {
  'cell-membrane-diagram': {
    en: cellMembraneEn,
    zh: cellMembraneZh,
  },
  'mitosis-diagram': {
    en: simpleLongTailPage('en', 'mitosis-diagram', {
      title: 'Mitosis Diagram - Create Cell Division Illustrations | SciDrawer',
      description:
        'Create a clear mitosis diagram showing prophase, metaphase, anaphase, telophase, and cytokinesis with labeled chromosomes and spindle fibers.',
      h1: 'Mitosis Diagram',
      intro:
        'Create a labeled cell division diagram for research, teaching, and scientific presentations.',
      current: 'Mitosis Diagram',
      heroImage: '/imgs/generated/cellular-architecture.png',
      heroAlt:
        'Cellular structure illustration used as a mitosis diagram starting point',
      focus: 'Plan a Clear Mitosis Diagram',
      focusText:
        'A readable mitosis diagram should make the sequence of cell division obvious while keeping chromosome behavior and spindle organization easy to inspect. Show the major stages in a stable order, use repeated cell outlines or panels, and reserve labels for structures that explain the stage. If the figure compares normal division with an experimental condition, use aligned panels and a concise legend rather than mixing both stories in one crowded cell.',
      stepsText:
        'Begin with the stage sequence and the biological claim. Decide which structures need labels, such as chromosomes, centrosomes, spindle fibers, nuclear envelope, or daughter cells. Use consistent colors and shapes across panels so the viewer can track the same structure as it changes. A prompt or sketch can start the layout, and the [AI figure generator](/generate) can create a visual draft before you refine the scientific details.',
      mistakesText:
        'Do not use different symbols for the same chromosome or spindle structure in different panels. Avoid collapsing stages so tightly that the order becomes ambiguous, and check that arrows describe time or movement rather than implying unsupported causality.',
      faq: [
        {
          question: 'Can I create a labeled mitosis diagram?',
          answer:
            'Yes. Name the stages and structures you need, then check the sequence and labels against your source material.',
        },
        {
          question: 'Can I show all stages of mitosis?',
          answer:
            'Yes. A repeated-panel or circular layout can show the stages, but keep the reading order obvious.',
        },
        {
          question: 'Can I use the diagram in a biology class?',
          answer:
            'Yes. Replace labels and terminology with the level appropriate for your students and review the biological accuracy.',
        },
        {
          question: 'Can I use a sketch as a reference?',
          answer:
            'Yes. A sketch is useful for communicating the order, panel layout, and desired labels.',
        },
        {
          question: 'Is a generated diagram automatically accurate?',
          answer:
            'No. Verify every stage, structure, arrow, and label before teaching or publishing it.',
        },
      ],
      relatedLabel: 'Mitosis Diagram',
    }),
    zh: simpleLongTailPage('zh', 'mitosis-diagram', {
      title: 'Mitosis Diagram - 创建有丝分裂示意图 | SciDrawer',
      description:
        '创建展示前期、中期、后期、末期和胞质分裂的有丝分裂示意图，并标注染色体和纺锤体。',
      h1: 'Mitosis Diagram',
      intro: '制作适合研究、教学和科研演示的有丝分裂标注图。',
      current: 'Mitosis Diagram',
      heroImage: '/imgs/generated/cellular-architecture.png',
      heroAlt: '可作为有丝分裂示意图起点的细胞结构插图',
      focus: '规划清晰的有丝分裂图',
      focusText:
        '清晰的有丝分裂图应该让分裂顺序一目了然，同时让染色体变化和纺锤体组织容易观察。可以用稳定顺序的面板或重复细胞轮廓表现主要阶段，并只保留能解释阶段差异的标签。',
      stepsText:
        '先确定阶段顺序和科学结论，再列出需要标注的结构。不同面板保持相同颜色和形状，便于追踪结构变化。可以从提示词或草图开始，再在 [AI 科研配图生成器](/generate) 中制作视觉草稿并核对细节。',
      mistakesText:
        '不要在不同面板中用不同符号表示同一个染色体或纺锤体结构，也不要把阶段压缩到读者无法判断顺序。箭头要说明时间或移动，不要暗示数据没有支持的因果关系。',
      faq: [
        {
          question: '可以制作有丝分裂标注图吗？',
          answer: '可以。写清需要的阶段和结构，再根据资料检查顺序与标签。',
        },
        {
          question: '可以展示有丝分裂的全部阶段吗？',
          answer: '可以。重复面板或循环式布局都可以，但要让阅读顺序明确。',
        },
        {
          question: '可以用于生物学课堂吗？',
          answer: '可以。根据学生程度替换标签和术语，并检查生物学准确性。',
        },
        {
          question: '可以用草图做参考吗？',
          answer: '可以，草图适合表达阶段顺序、面板布局和标签需求。',
        },
        {
          question: '生成图自动准确吗？',
          answer: '不一定。教学或发表前要核对每个阶段、结构、箭头和标签。',
        },
      ],
      relatedLabel: 'Mitosis Diagram',
    }),
  },
  'neuron-labeled': {
    en: simpleLongTailPage('en', 'neuron-labeled', {
      title: 'Neuron Labeled Diagram - Create Neuroscience Figures | SciDrawer',
      description:
        'Create a neuron labeled diagram with dendrites, soma, axon, myelin, and synaptic terminals for research figures, teaching, and presentations.',
      h1: 'Neuron Labeled Diagram',
      intro:
        'Make a clear labeled neuron diagram for anatomy, signaling, neuroscience research, and education.',
      current: 'Neuron Labeled Diagram',
      heroImage: '/imgs/generated/synapse-transmission.png',
      heroAlt:
        'Neuron transmission illustration for a labeled neuroscience diagram',
      focus: 'Build a Neuron Diagram That Reads Clearly',
      focusText:
        'A neuron labeled diagram should establish the direction from dendrites and soma through the axon to the synaptic terminals. The silhouette gives the reader a fast overview, while labels identify the structures needed for the research question. Add myelin, nodes, neurotransmitters, or a synapse when they explain the process; avoid filling the drawing with terms that do not support the point of the figure.',
      stepsText:
        'Choose whether the figure explains anatomy, action-potential movement, synaptic transmission, or a comparison between neuron states. Place the main cell body first, establish an axon direction, and then add callouts that do not cross the silhouette. For a signaling story, compare the neuron page with the [graphical abstract maker](/graphical-abstract-maker) and use the [generator](/generate) for a custom starting composition.',
      mistakesText:
        'Do not let leader lines cross the neuron or make all labels the same visual weight. Check the direction of signal flow, distinguish axon from dendrites, and verify that the image does not imply that every neuron has the same morphology.',
      faq: [
        {
          question: 'Can I label the main parts of a neuron?',
          answer:
            'Yes. Specify dendrites, soma, axon, myelin, nodes, or terminals as needed for the figure.',
        },
        {
          question: 'Can I show synaptic transmission?',
          answer:
            'Yes. Describe the pre-synaptic terminal, cleft, receptors, and direction of the signal, then review the result.',
        },
        {
          question: 'Can I use the diagram for teaching?',
          answer:
            'Yes. Adjust the number of labels and terminology for the audience and check the biology.',
        },
        {
          question: 'Can I start with a neuron sketch?',
          answer:
            'Yes. A sketch can guide the silhouette, signal direction, and callout positions.',
        },
        {
          question: 'Should I review a generated neuron figure?',
          answer:
            'Always. Check morphology, labels, signal direction, and any claim about the mechanism.',
        },
      ],
      relatedLabel: 'Neuron Labeled Diagram',
    }),
    zh: simpleLongTailPage('zh', 'neuron-labeled', {
      title: 'Neuron Labeled Diagram - 创建神经元标注图 | SciDrawer',
      description:
        '创建带有树突、胞体、轴突、髓鞘和突触末梢的神经元标注图，适合科研、教学和演示。',
      h1: 'Neuron Labeled Diagram',
      intro: '制作适合神经解剖、信号传递研究和教学的神经元标注图。',
      current: 'Neuron Labeled Diagram',
      heroImage: '/imgs/generated/synapse-transmission.png',
      heroAlt: '用于神经元标注图的神经信号传递插图',
      focus: '制作容易阅读的神经元示意图',
      focusText:
        '神经元标注图应该先建立从树突和胞体，经轴突到突触末梢的方向。轮廓帮助读者快速理解主体，标签再说明研究问题所需的结构。只有在能解释过程时才加入髓鞘、节点、神经递质或突触。',
      stepsText:
        '先确定图示是在解释解剖结构、动作电位移动、突触传递，还是神经元状态比较。先放置胞体和轴突方向，再添加不穿过主体的引线。需要完整视觉故事时，可以参考 [图形摘要制作工具](/graphical-abstract-maker)，并用 [生成器](/generate) 创建自定义构图。',
      mistakesText:
        '不要让引线穿过神经元，也不要让所有标签拥有相同权重。检查信号方向，区分轴突和树突，并确认图示没有暗示所有神经元形态都相同。',
      faq: [
        {
          question: '可以标注神经元主要结构吗？',
          answer: '可以。根据图示需要写出树突、胞体、轴突、髓鞘、节点或末梢。',
        },
        {
          question: '可以展示突触传递吗？',
          answer:
            '可以。说明突触前末梢、突触间隙、受体和信号方向，再检查结果。',
        },
        {
          question: '可以用于教学吗？',
          answer: '可以。根据受众调整标签数量和术语，并检查生物学内容。',
        },
        {
          question: '可以从神经元草图开始吗？',
          answer: '可以，草图可以指导轮廓、信号方向和引线位置。',
        },
        {
          question: '生成的神经元图需要审核吗？',
          answer: '需要。检查形态、标签、信号方向以及对机制的陈述。',
        },
      ],
      relatedLabel: 'Neuron Labeled Diagram',
    }),
  },
};

export function getTemplatePageContent(
  slug: LongTailSlug,
  locale: string
): SeoPageContent {
  return templatePages[slug][locale === 'zh' ? 'zh' : 'en'];
}

export type { LongTailSlug };
