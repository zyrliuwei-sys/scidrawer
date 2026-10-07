export type SeoLocale = 'en' | 'zh';

export type SeoLink = {
  label: string;
  href: string;
};

export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoExample = {
  title: string;
  image: string;
  alt: string;
  description: string;
};

export type SeoSubsection = {
  heading: string;
  paragraphs: string[];
  links?: SeoLink[];
};

export type SeoSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  subsections?: SeoSubsection[];
  examples?: SeoExample[];
  links?: SeoLink[];
};

export type SeoToolAspect = '16:9' | '4:3' | '1:1';

export type SeoToolLayout = {
  id: string;
  label: string;
  description: string;
  /** English instruction sent to the image model for this layout. */
  prompt: string;
};

/**
 * A keyword-specific preset of the /generate workspace, rendered in the hero
 * of an SEO landing page so the page itself is the tool searchers expect.
 */
export type SeoTool = {
  heading: string;
  description: string;
  inputLabel: string;
  inputPlaceholder: string;
  exampleLabel: string;
  exampleText: string;
  layoutLabel: string;
  layouts: SeoToolLayout[];
  aspectLabel: string;
  aspects: { value: SeoToolAspect; label: string }[];
  defaultAspect: SeoToolAspect;
  submitLabel: string;
  emptyError: string;
  note: string;
  /** English framing placed before the layout and the user's text. */
  promptPrefix: string;
};

export type SeoPageContent = {
  locale: SeoLocale;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  heroImage: string;
  heroImageAlt: string;
  breadcrumbHome: string;
  breadcrumbLibrary: string;
  breadcrumbCurrent: string;
  ctaLabel: string;
  sections: SeoSection[];
  faqHeading: string;
  faq: SeoFaq[];
  tryHeading: string;
  tryParagraph: string;
  tryLabel: string;
  relatedHeading: string;
  relatedDescription: string;
  relatedLinks: SeoLink[];
  tool?: SeoTool;
};

const commonEn = {
  breadcrumbHome: 'Home',
  breadcrumbLibrary: 'Templates',
  faqHeading: 'FAQ',
  tryHeading: 'Try SciDrawer',
  tryLabel: 'Open the AI figure generator',
  relatedHeading: 'Related tools',
  relatedDescription:
    'Continue from a focused template page, explore more research visuals, or open the generator when you are ready to make your own figure.',
};

const commonZh = {
  breadcrumbHome: '首页',
  breadcrumbLibrary: '模板',
  faqHeading: '常见问题',
  tryHeading: '试用 SciDrawer',
  tryLabel: '打开 AI 科研配图生成器',
  relatedHeading: '相关工具',
  relatedDescription:
    '从具体模板页继续浏览更多科研视觉案例，或在准备好后打开生成器制作自己的图示。',
};

const graphicalAbstractEn: SeoPageContent = {
  locale: 'en',
  title:
    'Graphical Abstract Maker - Create Publication-Ready Summaries | SciDrawer',
  description:
    "Turn your study's question, method and main finding into a publication-ready graphical abstract. Built for journal submission, with editable templates and AI generation from a prompt or sketch. Try SciDrawer free.",
  eyebrow: 'Visual research summary',
  h1: 'Graphical Abstract Maker',
  intro:
    'Create a publication-ready graphical abstract that turns your study question, method, and main finding into one clear visual story.',
  heroImage: '/imgs/showcase/graphical-abstracts.svg',
  heroImageAlt: 'Example graphical abstract showing a research story in panels',
  breadcrumbHome: commonEn.breadcrumbHome,
  breadcrumbLibrary: commonEn.breadcrumbLibrary,
  breadcrumbCurrent: 'Graphical Abstract Maker',
  ctaLabel: 'Create a graphical abstract',
  sections: [
    {
      heading: 'What Is a Graphical Abstract?',
      paragraphs: [
        'A graphical abstract is a compact visual summary of a research paper. It usually connects the research question, the main method or intervention, and the most important result with a small number of illustrations, labels, and directional cues. Unlike a decorative figure, a good graphical abstract has a beginning, a middle, and an end: a reader should be able to understand what was studied, how it was studied, and what was learned without opening the full manuscript. The format may be a horizontal sequence, a comparison, a process, or a central concept with supporting branches, depending on the story of the work.',
        'Journals ask for graphical abstracts because editors, reviewers, and readers often scan many papers in a short time. A concise visual can make the scope of a paper easier to recognize in a table of contents, on a journal landing page, or when it is shared in a lab meeting or on social media. It does not replace the written abstract, the results figures, or the paper itself. Instead, it provides an accessible first explanation and helps the right audience decide whether the full study is relevant. The strongest graphical abstracts leave out secondary details while preserving the scientific relationship between the question, evidence, and conclusion.',
      ],
      links: [
        { label: 'Browse graphical abstract templates', href: '/templates' },
        { label: 'Start from a research prompt', href: '/generate' },
      ],
    },
    {
      heading: 'What Journals Require',
      paragraphs: [
        'Journal instructions differ, so the safest approach is to check the target journal before exporting. As a general requirement, a graphical abstract should fit the journal’s stated dimensions or aspect ratio, remain legible at the displayed size, and use a resolution appropriate for online publication and production workflows. Many teams work on a larger canvas and then test a reduced version so that labels, arrows, and symbols remain readable in a browser, a PDF proof, and a content-management system. Keep the final artwork clean, with generous spacing and a visual hierarchy that survives compression.',
        'Common delivery formats include PNG, JPEG, PDF, and sometimes TIFF or an editable vector format. The exact choice depends on the journal and on whether the file is being used online, in print, or in a submission portal. Use a high-resolution export when the instructions allow it, keep text as text where possible, and avoid screenshots of a low-resolution canvas. Font size, contrast, line weight, color accessibility, and embedded fonts also deserve a final check. These are general publishing practices rather than rules for a specific journal; always compare them with the current author guidelines for your submission.',
      ],
      bullets: [
        'Confirm the required canvas size, aspect ratio, and maximum file size before designing.',
        'Use sufficient resolution and test the image at the size readers will actually see.',
        'Choose a file format that preserves crisp text, transparent areas, and color reliably.',
        'Keep labels, legends, and symbols consistent with the terminology used in the manuscript.',
      ],
    },
    {
      heading: 'How to Make One, Step by Step',
      paragraphs: [
        'Start with the scientific story rather than the decoration. A simple outline makes it easier to decide what belongs in the visual and what should remain in the paper. The four steps below work for a new design, an editable template, or an AI-generated first draft that you plan to refine for submission.',
      ],
      subsections: [
        {
          heading: 'Extract the research question',
          paragraphs: [
            'Write one sentence that names the problem, system, intervention, or comparison your study addresses. Then write one sentence for the main finding. These two sentences are the guardrails for the graphical abstract. Select only the method details that explain the path between them: a sample, treatment, measurement, model, or analysis step. If a detail does not help the reader understand the conclusion, it can usually be removed or moved to the full paper. A prompt or rough sketch is often enough to begin an AI-assisted draft in the [AI figure generator](/generate).',
          ],
        },
        {
          heading: 'Choose a visual structure',
          paragraphs: [
            'Choose a flow-style layout when the work has a clear sequence from input to result. Use a comparison layout when the central message is a difference between groups, conditions, or time points. A circular or feedback layout works for cycles, signaling loops, ecological systems, and repeated experimental stages. The structure should match the logic of the research, not the other way around. Starting from an editable [graphical abstract template](/templates) can help you test several visual grammars before you commit to one.',
          ],
        },
        {
          heading: 'Add figures and annotations',
          paragraphs: [
            'Use one visual language throughout: similar line weights, a restrained palette, consistent arrowheads, and a clear label style. Draw attention to the main result with scale, position, or contrast instead of adding more colors everywhere. Keep annotations short and place them close to the object or process they describe. If a pathway has many names, show the relationships first and move secondary terminology to a small legend. The [SciDrawer templates](/templates) provide useful starting points for balancing icons, labels, and whitespace.',
          ],
        },
        {
          heading: 'Export for submission',
          paragraphs: [
            'Review the design at full size and at a reduced preview. Check that the first reading path is obvious, all text is legible, arrows do not cross labels, and the conclusion agrees with the written abstract. Export the format and resolution requested by the target journal, and keep an editable source version for later revisions. You can use the [generator](/generate) to make a new draft, compare variants, and prepare a high-resolution starting image before final editorial cleanup.',
          ],
        },
      ],
    },
    {
      heading: 'Graphical Abstract Examples',
      paragraphs: [
        'Examples are most useful when they are read as design decisions rather than copied as decoration. The four studies below use different visual structures, but each keeps the research question and conclusion easy to locate. They also demonstrate why a graphical abstract should be edited after the first draft: the goal is not to show every experimental detail, but to make the central claim memorable and accurate.',
      ],
      examples: [
        {
          title: 'RNA therapeutic delivery',
          image: '/imgs/generated/rna-therapeutic-delivery.png',
          alt: 'Three-panel RNA therapeutic delivery graphical abstract example',
          description:
            'This example uses a left-to-right three-stage flow: formulation, delivery, and cellular response. Repeating panel proportions create a predictable reading path, while the final protein-expression result receives the strongest visual emphasis. The layout works because each panel answers one question and the arrows explain the relationship between them.',
        },
        {
          title: 'Cellular mechanism summary',
          image: '/imgs/showcase/graphical-abstracts.svg',
          alt: 'Graphical abstract example with connected research panels',
          description:
            'The connected panels make a complex study feel sequential without turning it into a dense protocol. A limited palette separates stages, not individual concepts, so the reader can understand the story before reading every label. This is a useful pattern when the study combines an intervention, a biological mechanism, and a measured outcome.',
        },
        {
          title: 'Signal transduction result',
          image: '/imgs/generated/signaling-cascade.png',
          alt: 'Scientific signaling cascade example used as a graphical abstract reference',
          description:
            'Here the membrane-to-nucleus direction provides the main axis. Arrows and spatial compartments carry the explanation, while concise labels prevent the pathway from becoming a paragraph. The design is effective because the viewer can follow the mechanism first and inspect the molecular names second.',
        },
        {
          title: 'Genome repair workflow',
          image: '/imgs/generated/crispr-repair.png',
          alt: 'Genome repair workflow graphical abstract example',
          description:
            'A workflow structure is appropriate for a design in which an intervention leads to a repair event and an observable result. The important choice is to show the before-and-after relationship clearly, then use small annotations to explain the intervention. That keeps the result from being buried under technical labels.',
        },
      ],
    },
    {
      heading: 'Common Mistakes to Avoid',
      paragraphs: [
        'The most common problem is information overload. Authors often try to include every assay, control, gene name, and statistical result, which makes the visual look like a miniature paper rather than a summary. A better approach is to decide on one primary reading path and one primary conclusion. Remove repeated labels, combine related steps, and use a short legend only when it improves comprehension. A reader should be able to describe the story after a few seconds, even if they need the manuscript for the details.',
        'Legibility problems are equally damaging. Tiny type, weak contrast, decorative gradients, and too many similar colors can make accurate science difficult to read. The graphical abstract should agree with the written abstract and the main figures; a mismatch in terminology or direction can undermine trust. Before submission, ask someone outside the project to explain what they see without coaching. Their questions will reveal whether a missing label, ambiguous arrow, or crowded region needs revision.',
      ],
      bullets: [
        'Avoid turning every result into an equal-sized visual element.',
        'Do not rely on color alone to communicate a comparison or a change.',
        'Remove labels that do not support the stated research question or finding.',
        'Check that the final visual does not imply a stronger conclusion than the data support.',
      ],
    },
    {
      heading: 'Templates to Start From',
      paragraphs: [
        'A template is most valuable when it gives the study a clear structure without locking you into someone else’s content. Begin with the [scientific diagram templates](/templates) to compare flow, comparison, and labeled layouts. A specific [plant cell labeled diagram](/plant-cell-labeled) is useful when your work needs an anatomy-first visual vocabulary, while the graphical abstract layouts on this page are better for a question-method-finding story.',
        'Once the structure is chosen, replace the sample labels with the terms from your manuscript and remove every placeholder that does not apply. The [full template library](/templates) is a quick way to explore alternatives, and the [SciDrawer home page](/) explains how the same workflow can support papers, posters, and presentations. When the story is clear, open the [AI generator](/generate) to make a customized starting point from a prompt, sketch, or reference image.',
      ],
      links: [
        { label: 'Explore all templates', href: '/templates' },
        {
          label: 'Open the plant cell labeled example',
          href: '/plant-cell-labeled',
        },
        { label: 'Visit SciDrawer home', href: '/' },
        { label: 'Generate a custom figure', href: '/generate' },
      ],
    },
  ],
  faqHeading: commonEn.faqHeading,
  faq: [
    {
      question: 'Do I need to pay to make a graphical abstract?',
      answer:
        'You can start exploring SciDrawer and create an initial draft with the available free usage. Paid plans provide additional credits and generation capacity when you need more iterations or higher-volume work.',
    },
    {
      question: 'Can I edit the graphical abstract after generating it?',
      answer:
        'Yes. Treat the AI output as a starting point: refine the prompt, use a sketch or reference image, and continue editing the visual for accurate labels, terminology, and journal-specific presentation requirements.',
    },
    {
      question: 'What file formats can I use?',
      answer:
        'You can begin with a text prompt, sketch, or reference image. The final file format and resolution should follow the submission instructions of your target journal; check those instructions before exporting.',
    },
    {
      question:
        'Can I use a graphical abstract for a Chinese-language journal?',
      answer:
        'Yes. The design principles are language-independent. Replace the labels with the terminology used in the Chinese manuscript, confirm font support and readability, and follow the journal’s current file specifications.',
    },
    {
      question:
        'How is a graphical abstract different from a written abstract?',
      answer:
        'A written abstract explains the study in sentences and usually includes more context and detail. A graphical abstract compresses the question, method, and main finding into a visual sequence that can be understood quickly.',
    },
    {
      question: 'How long does it take to make one?',
      answer:
        'A first draft can take minutes when the research story and visual structure are already clear. Allow extra time for checking labels, simplifying the composition, and matching the target journal’s requirements.',
    },
    {
      question: 'Can I export a high-resolution graphical abstract?',
      answer:
        'SciDrawer can produce high-resolution starting images. Before submission, confirm the exact pixel dimensions, resolution, color mode, and file-size limits requested by the journal.',
    },
    {
      question: 'Is there a free usage allowance?',
      answer:
        'SciDrawer offers free usage so you can test the workflow before choosing a paid plan. The amount of available generation depends on the current account and credit configuration.',
    },
    {
      question: 'Can I use my own sketch or reference figure?',
      answer:
        'Yes. A sketch or reference image can communicate layout, composition, or visual vocabulary that is difficult to express in words. Use it as a guide, then verify every scientific detail in the result.',
    },
  ],
  tryHeading: commonEn.tryHeading,
  tryParagraph:
    'When your research story is ready, turn the question, method, and finding into a visual draft with SciDrawer. Start from a prompt, upload a sketch, or provide a reference image, then refine the composition for your paper and journal workflow.',
  tryLabel: commonEn.tryLabel,
  relatedHeading: commonEn.relatedHeading,
  relatedDescription: commonEn.relatedDescription,
  relatedLinks: [
    { label: 'Scientific Poster Maker', href: '/scientific-poster-maker' },
    { label: 'Scientific Diagram Maker', href: '/scientific-diagram-maker' },
    { label: 'AI Scientific Figure Generator', href: '/generate' },
  ],
};

const graphicalAbstractZh: SeoPageContent = {
  locale: 'zh',
  title: '图形摘要制作工具 - 创建可投稿的研究摘要 | SciDrawer',
  description:
    '将研究问题、方法和主要发现整理为适合投稿的图形摘要。支持可编辑模板，以及通过提示词或草图进行 AI 生成，免费试用 SciDrawer。',
  eyebrow: '研究视觉摘要',
  h1: '图形摘要制作工具',
  intro:
    '用一张适合投稿的图形摘要，把研究问题、方法和主要发现组织成清晰易懂的视觉故事。',
  heroImage: '/imgs/showcase/graphical-abstracts.svg',
  heroImageAlt: '由多个研究步骤组成的图形摘要示例',
  breadcrumbHome: commonZh.breadcrumbHome,
  breadcrumbLibrary: commonZh.breadcrumbLibrary,
  breadcrumbCurrent: '图形摘要制作工具',
  ctaLabel: '创建图形摘要',
  sections: [
    {
      heading: '什么是图形摘要？',
      paragraphs: [
        '图形摘要是论文内容的紧凑视觉总结，通常把研究问题、主要方法或干预措施，以及最重要的结果连接在一起。它不是装饰性配图，而是一条有起点、中间步骤和结论的视觉叙事：读者即使还没有打开全文，也应该能够大致理解研究对象、研究方法和研究发现。根据研究故事的不同，图形摘要可以采用横向流程、组间对比、循环关系，或者以核心概念为中心、向外展开辅助信息的结构。',
        '期刊需要图形摘要，是因为编辑、审稿人和读者往往需要在很短时间内浏览大量论文。一张清楚的视觉摘要可以帮助读者在目录、期刊页面、实验室讨论或社交分享中快速判断论文是否相关。它不能替代文字摘要、结果图或论文正文，而是作为进入全文之前的第一层说明。好的图形摘要会主动舍弃次要细节，同时准确保留问题、证据和结论之间的科学关系。',
      ],
      links: [
        { label: '浏览图形摘要模板', href: '/templates' },
        { label: '从研究提示词开始', href: '/generate' },
      ],
    },
    {
      heading: '期刊一般要求什么？',
      paragraphs: [
        '不同期刊的投稿说明并不完全相同，因此导出前应先查看目标期刊的最新要求。一般来说，图形摘要需要符合指定尺寸或比例，在实际展示尺寸下保持清晰，并使用适合网页和出版流程的分辨率。许多团队会先用较大的画布设计，再缩小预览，以检查文字、箭头和符号在浏览器、PDF 校样和期刊内容管理系统中是否仍然可读。画面应保持整洁，并用稳定的层级突出主线。',
        '常见交付格式包括 PNG、JPEG、PDF，有些投稿系统还会接受 TIFF 或可编辑的矢量格式。具体选择取决于期刊以及图片是用于网页、印刷还是投稿门户。允许时应使用高分辨率导出，尽量保留文字信息，不要把低分辨率截图当作最终文件。字号、对比度、线条粗细、色彩可读性和字体嵌入都应在提交前检查。以上是通用的出版实践，不代表某一家期刊的具体规定，最终请以当前作者指南为准。',
      ],
      bullets: [
        '在设计前确认画布尺寸、比例和文件大小限制。',
        '用目标展示尺寸预览，确认字号和细线仍然清晰。',
        '选择能稳定保留文字、透明区域和颜色的文件格式。',
        '让标注、图例和符号与论文中的术语保持一致。',
      ],
    },
    {
      heading: '如何一步一步制作图形摘要？',
      paragraphs: [
        '先整理科学故事，再考虑装饰细节。一个简短提纲可以帮助你决定哪些信息必须进入视觉图，哪些信息应该留在论文正文中。下面四个步骤适用于从零设计、修改可编辑模板，也适用于先用 AI 生成草稿、再进行投稿前精修的工作流。',
      ],
      subsections: [
        {
          heading: '提炼研究问题',
          paragraphs: [
            '先用一句话说明研究要解决的问题、研究系统、干预措施或比较关系，再用一句话写出主要发现。这两句话就是图形摘要的边界。只保留能够解释问题如何走向结论的方法细节，例如样本、处理、测量、模型或分析步骤。如果一个细节不能帮助读者理解结论，通常可以删掉，或者留给论文正文。在 [AI 科研配图生成器](/generate) 中输入研究提示词或草图，就可以从第一版视觉草稿开始。',
          ],
        },
        {
          heading: '选择视觉结构',
          paragraphs: [
            '当研究有明确的输入到结果顺序时，适合选择流程式结构；当核心信息是两组条件、时间点或干预之间的差异时，适合选择对比式结构；当研究涉及循环、反馈、信号通路或重复实验阶段时，可以使用循环式结构。结构应该服务于研究逻辑，而不是让研究内容去迁就模板。先浏览 [图形摘要模板](/templates)，比较不同视觉语法，再决定最终排版。',
          ],
        },
        {
          heading: '配置配图与标注',
          paragraphs: [
            '全图尽量使用一致的视觉语言，例如相近的线条粗细、克制的配色、统一的箭头和统一的标签样式。用大小、位置和对比度突出主要结果，而不要把所有元素都涂成醒目的颜色。标注应该短小，并尽量靠近它描述的对象或步骤。如果一个通路包含很多名称，可以先画清关系，再把次要术语放进小图例。[SciDrawer 模板库](/templates) 可以帮助你平衡图标、标注和留白。',
          ],
        },
        {
          heading: '导出并准备投稿',
          paragraphs: [
            '分别在原始尺寸和缩小预览下检查排版，确认第一阅读路径明确、文字可读、箭头不穿过标注，并且图中结论与文字摘要一致。按照目标期刊要求导出格式和分辨率，同时保留可编辑的源文件，方便后续修改。你也可以先在 [生成器](/generate) 中生成多个版本，再挑选一个进行投稿前的文字和细节校正。',
          ],
        },
      ],
    },
    {
      heading: '图形摘要示例',
      paragraphs: [
        '查看示例时，重点应放在排版决策，而不是直接复制装饰元素。下面的四个案例采用不同结构，但都让研究问题和结论容易被找到。它们也说明了为什么 AI 或模板生成的第一版仍然需要编辑：目标不是把所有实验细节都塞进一张图，而是让核心发现准确、清晰并且容易记住。',
      ],
      examples: [
        {
          title: 'RNA 治疗递送',
          image: '/imgs/generated/rna-therapeutic-delivery.png',
          alt: '三段式 RNA 治疗递送图形摘要示例',
          description:
            '这张图用从左到右的三段流程表现配方、递送和细胞反应。重复的面板比例建立了稳定的阅读路径，最后的蛋白表达结果获得了最明显的视觉强调。每个面板回答一个问题，箭头说明面板之间的关系，因此信息不会显得零散。',
        },
        {
          title: '细胞机制总结',
          image: '/imgs/showcase/graphical-abstracts.svg',
          alt: '由多个研究面板连接而成的图形摘要示例',
          description:
            '连接起来的面板让复杂研究具有顺序感，同时避免把画面做成密集的实验流程。有限的颜色用来区分阶段，而不是给每个概念安排一种颜色，所以读者即使不读完全部标签，也能理解整体故事。',
        },
        {
          title: '信号转导结果',
          image: '/imgs/generated/signaling-cascade.png',
          alt: '作为图形摘要参考的信号级联示例',
          description:
            '细胞膜到细胞核的方向构成主轴，箭头和空间分区承担主要解释功能，简短标签则避免通路变成一整段文字。先让读者跟随机制，再阅读分子名称，是这种排版有效的原因。',
        },
        {
          title: '基因修复流程',
          image: '/imgs/generated/crispr-repair.png',
          alt: '基因组修复流程图形摘要示例',
          description:
            '当干预措施会带来修复事件和可观察结果时，流程式排版非常合适。先清楚表达前后变化，再用小型标注解释干预步骤，可以避免结果被技术名词淹没。',
        },
      ],
    },
    {
      heading: '常见错误与改进方法',
      paragraphs: [
        '最常见的问题是信息过载。作者常常想把每个实验、对照、基因名称和统计结果都放进去，最后得到的不是摘要，而是一张缩小版论文。更好的做法是只确定一条主要阅读路径和一个主要结论，删掉重复标注，合并相近步骤，只有在确实能帮助理解时才使用图例。读者应该在几秒钟内复述故事主线，细节则留给论文正文。',
        '可读性问题同样会削弱科学表达。过小的字号、低对比度、装饰性渐变和过多相近颜色，都会让准确的信息难以阅读。图形摘要应该和文字摘要、主要结果图保持一致，术语或方向不一致会降低可信度。提交前可以请项目之外的人在没有讲解的情况下描述他们看到的内容，他们提出的问题通常能帮助你发现缺失标注、含义不明的箭头和拥挤区域。',
      ],
      bullets: [
        '不要让所有结果都使用相同大小和相同权重。',
        '不要只依靠颜色表达对比或变化。',
        '删去不支持研究问题或主要发现的标签。',
        '确认视觉图没有暗示超出数据支持范围的结论。',
      ],
    },
    {
      heading: '从模板开始制作',
      paragraphs: [
        '模板的价值在于提供清晰结构，而不是把你的研究锁定在别人的内容上。可以先浏览 [科研图示模板](/templates)，比较流程式、对比式和标注式布局；如果研究需要以细胞结构为视觉词汇，可以参考 [植物细胞标注图](/plant-cell-labeled)；如果要讲清研究问题、方法和发现之间的关系，则更适合使用本页的图形摘要结构。',
        '确定结构后，用论文中的术语替换示例标签，并删除所有不适用的占位内容。[完整模板库](/templates) 适合快速比较不同方案，[SciDrawer 首页](/) 可以了解论文、海报和演示文稿的整体工作流。故事明确后，再打开 [AI 生成器](/generate)，用提示词、草图或参考图制作定制化起点。',
      ],
      links: [
        { label: '浏览全部模板', href: '/templates' },
        { label: '查看植物细胞标注示例', href: '/plant-cell-labeled' },
        { label: '访问 SciDrawer 首页', href: '/' },
        { label: '生成自定义图示', href: '/generate' },
      ],
    },
  ],
  faqHeading: commonZh.faqHeading,
  faq: [
    {
      question: '制作图形摘要一定要付费吗？',
      answer:
        '你可以先使用 SciDrawer 的免费额度体验工作流并制作初稿。付费方案会提供更多积分和生成容量，适合需要多轮迭代或批量制作的情况。',
    },
    {
      question: '生成后还能修改图形摘要吗？',
      answer:
        '可以。AI 输出适合作为起点，你可以继续调整提示词、提供草图或参考图，并在投稿前校正标签、术语和排版。',
    },
    {
      question: '支持哪些文件格式？',
      answer:
        '你可以从文字提示词、草图或参考图开始。最终格式和分辨率应以目标期刊的投稿说明为准，导出前请先核对具体要求。',
    },
    {
      question: '中文期刊可以使用图形摘要吗？',
      answer:
        '可以。视觉设计原则与语言无关，只需替换为中文论文中的术语，并确认字体支持、字号和可读性符合期刊要求。',
    },
    {
      question: '图形摘要和文字摘要有什么区别？',
      answer:
        '文字摘要用句子解释研究并承载更多背景和细节，图形摘要则把问题、方法和主要发现压缩成一条可以快速理解的视觉路径。',
    },
    {
      question: '制作一张图形摘要需要多久？',
      answer:
        '如果研究故事和视觉结构已经明确，初稿可能几分钟就能完成。投稿前还应预留时间检查标签、简化构图并核对期刊要求。',
    },
    {
      question: '可以导出高分辨率图形摘要吗？',
      answer:
        'SciDrawer 可以生成高分辨率的起始图。正式投稿前，请再次确认目标期刊要求的像素尺寸、分辨率、色彩模式和文件大小。',
    },
    {
      question: '有没有免费额度？',
      answer:
        'SciDrawer 提供免费额度用于体验工作流。具体可用生成量取决于当前账户和积分配置。',
    },
    {
      question: '可以使用自己的草图或参考图吗？',
      answer:
        '可以。草图或参考图能够表达文字难以说明的构图和视觉词汇，但生成结果中的每一项科学细节仍应由你检查和确认。',
    },
  ],
  tryHeading: commonZh.tryHeading,
  tryParagraph:
    '当研究故事已经清晰，就可以用 SciDrawer 把问题、方法和发现整理成视觉草稿。从提示词开始，上传草图或参考图，再针对论文和目标期刊的工作流进行调整。',
  tryLabel: commonZh.tryLabel,
  relatedHeading: commonZh.relatedHeading,
  relatedDescription: commonZh.relatedDescription,
  relatedLinks: [
    { label: 'Scientific Poster Maker', href: '/scientific-poster-maker' },
    { label: 'Scientific Diagram Maker', href: '/scientific-diagram-maker' },
    { label: 'AI 科研配图生成器', href: '/generate' },
  ],
};

const scientificDiagramEn: SeoPageContent = {
  locale: 'en',
  title:
    'Scientific Diagram Maker - Create Research Diagrams with AI | SciDrawer',
  description:
    'Make publication-ready scientific diagrams from a text prompt, sketch or reference image. Covers mechanisms, pathways and labeled diagrams, with editable templates. Try it free.',
  eyebrow: 'Research diagram workspace',
  h1: 'Scientific Diagram Maker',
  intro:
    'Create publication-ready research diagrams from a text prompt, sketch, or reference image, then refine the visual structure for your paper.',
  heroImage: '/imgs/showcase/mechanism-pathways.svg',
  heroImageAlt: 'Scientific mechanism and pathway diagram example',
  breadcrumbHome: commonEn.breadcrumbHome,
  breadcrumbLibrary: commonEn.breadcrumbLibrary,
  breadcrumbCurrent: 'Scientific Diagram Maker',
  ctaLabel: 'Make a scientific diagram',
  sections: [
    {
      heading: 'What Is a Scientific Diagram?',
      paragraphs: [
        'A scientific diagram is a visual explanation of a structure, mechanism, pathway, workflow, or relationship in a research context. It is more deliberate than a generic illustration: objects have scientific meaning, arrows describe a relationship or direction, and labels help the reader connect the visual model with the terminology in the manuscript. A diagram can show what a system contains, how a process changes over time, or how several components interact. The best diagrams reduce cognitive load without reducing the underlying science to decoration.',
        'Researchers use diagrams in manuscripts, graphical abstracts, posters, lectures, grant applications, and lab documentation. A consistent diagram style helps the same study travel across those formats while keeping its terminology stable. SciDrawer is designed to help you move from a written description or rough sketch to a useful first composition. You remain responsible for checking the scientific accuracy, scale, direction, and wording before using an output in a publication or presentation.',
      ],
      links: [
        { label: 'Explore scientific diagram templates', href: '/templates' },
        { label: 'Open the AI generator', href: '/generate' },
      ],
    },
    {
      heading: 'Common Types of Scientific Diagrams',
      paragraphs: [
        'Different research questions call for different visual grammars. Choosing a type before drawing helps the reader know what to look for and keeps the layout from becoming a collection of unrelated icons. The three categories below cover many common use cases, and they can also be combined when a study moves from a mechanism to a measurable outcome.',
      ],
      subsections: [
        {
          heading: 'Mechanism diagram',
          paragraphs: [
            'A mechanism diagram explains how an intervention, interaction, or biological event produces a change. Use spatial compartments to separate locations such as membrane, cytoplasm, nucleus, tissue, or device layers. Arrows should communicate activation, transport, inhibition, or transformation, while short labels identify the essential entities. Avoid drawing every molecule if the research question concerns a higher-level mechanism; a clear causal chain is more valuable than an exhaustive inventory.',
          ],
        },
        {
          heading: 'Pathway diagram',
          paragraphs: [
            'A pathway diagram emphasizes sequence, branching, feedback, or convergence. It is useful for signaling cascades, metabolic routes, experimental workflows, treatment response, and data-processing pipelines. Establish a reading direction and use consistent arrowheads. If there are branches, align them to make the alternatives visible. If there is feedback, distinguish it from the main direction with a different line treatment or a short annotation rather than allowing it to cross the entire composition.',
          ],
        },
        {
          heading: 'Labeled diagram',
          paragraphs: [
            'A labeled diagram identifies the parts of a structure, specimen, device, or model. It works best when the object occupies a stable central area and leader lines connect labels without crossing. Group labels by region, keep terms short, and use a small legend for repeated symbols. A [plant cell labeled diagram](/plant-cell-labeled) is a useful example of how a recognizable structure can carry many labels while retaining a clear silhouette.',
          ],
        },
      ],
    },
    {
      heading: 'How to Make a Scientific Diagram, Step by Step',
      paragraphs: [
        'The fastest route to a strong diagram is to make the scientific relationships explicit before choosing colors or decorative elements. Use the workflow below whether you are drawing from scratch, adapting a template, or asking an AI tool for a first draft.',
      ],
      subsections: [
        {
          heading: 'Define the claim and the entities',
          paragraphs: [
            'Write the one-sentence claim the diagram should support. List only the entities needed to explain that claim, then group them by compartment, stage, or role. This prevents a mechanism diagram from becoming a glossary and prevents a labeled diagram from hiding its main shape under text. A precise prompt that names the entities, relationships, and desired reading direction will produce a more useful starting point in the [AI generator](/generate).',
          ],
        },
        {
          heading: 'Select a layout grammar',
          paragraphs: [
            'Use a left-to-right or top-to-bottom flow for sequential steps, a central object with callouts for labeled structures, and compartments or lanes for mechanisms that depend on location. A comparison layout is appropriate when the main claim is a difference between conditions. Browse the [template library](/templates) to see how a fixed grid, repeated panels, and consistent spacing can make a complex explanation easier to scan.',
          ],
        },
        {
          heading: 'Draw relationships before details',
          paragraphs: [
            'Place the major objects and arrows first. Check that the diagram can be understood in grayscale or with the labels temporarily hidden. Add only the details that change the interpretation: a receptor, a transport step, a control group, a measured output, or a key structural landmark. Use a consistent visual vocabulary for activation, inhibition, movement, and uncertainty, and explain any non-obvious symbol in a legend.',
          ],
        },
        {
          heading: 'Review accuracy and export',
          paragraphs: [
            'Compare every label and arrow with the manuscript, source literature, or validated protocol. Check whether the visual implies a scale, order, or causal certainty that the evidence does not support. Test the image at the final display size, then export the required file format and keep an editable version. For a figure that will later become a graphical abstract, you can also compare it with the [graphical abstract maker](/graphical-abstract-maker) workflow.',
          ],
        },
      ],
    },
    {
      heading: 'Scientific Diagram Examples',
      paragraphs: [
        'A useful example is not just a picture to imitate; it shows how visual structure carries meaning. These references cover anatomy, mechanisms, pathways, and laboratory workflows. Notice how each one establishes a dominant reading path and uses labels as support rather than as the entire explanation.',
      ],
      examples: [
        {
          title: 'Plant cell labeled diagram',
          image: '/imgs/diagrams/plant-cell-labeled.svg',
          alt: 'Labeled plant cell diagram with organelles',
          description:
            'The central cell silhouette creates a stable anchor for the labels. Leader lines point outward, so the text does not obscure the organelles, and the recognizable outer boundary makes the diagram readable before every term is inspected.',
        },
        {
          title: 'Mechanism and pathway overview',
          image: '/imgs/showcase/mechanism-pathways.svg',
          alt: 'Mechanism and pathway diagram example',
          description:
            'The pathway view separates stages into a horizontal sequence and uses arrows to show direction. This makes it suitable for communicating a mechanism without requiring the reader to decode a dense network of crossing lines.',
        },
        {
          title: 'Microfluidic workflow',
          image: '/imgs/generated/microfluidic-workflow.png',
          alt: 'Microfluidic laboratory workflow scientific diagram',
          description:
            'Repeated stages and consistent panel spacing turn a lab procedure into a compact workflow. The viewer can see the order of operations first and use the shorter annotations to understand what changes at each stage.',
        },
        {
          title: 'Cellular signaling cascade',
          image: '/imgs/generated/signaling-cascade.png',
          alt: 'Cell signaling cascade mechanism diagram',
          description:
            'Compartment boundaries establish where the events occur, while directional arrows explain the transition from receptor activation to nuclear response. The layout keeps molecular detail subordinate to the mechanism.',
        },
      ],
    },
    {
      heading: 'Common Scientific Diagram Mistakes',
      paragraphs: [
        'A crowded diagram often indicates that the claim has not been narrowed enough. Adding more labels cannot fix an unclear relationship between the main entities. Start again with the claim, remove supporting details that do not change the interpretation, and use grouping or a second figure when two stories compete for the same space. The reader should know what is primary, what is supporting, and where the visual begins and ends.',
        'Another frequent issue is inconsistent notation. An arrow that means activation in one area should not mean movement in another unless the legend makes that distinction explicit. Avoid relying on color alone, especially when the figure will be printed or viewed by readers with color-vision differences. Small type, weak contrast, crossed leader lines, and unlabeled abbreviations can make a scientifically correct diagram unusable.',
      ],
      bullets: [
        'Do not mix several layout directions without a clear reason.',
        'Do not use decorative icons when a simpler scientific symbol is clearer.',
        'Check that every arrow has a relationship or process to explain.',
        'Keep labels consistent with the terminology and abbreviations in the paper.',
      ],
    },
    {
      heading: 'Templates and Related Figure Workflows',
      paragraphs: [
        'Start with a template when you know the kind of explanation you need but do not want to spend time rebuilding a grid, label system, or panel rhythm. The [scientific diagram templates](/templates) provide a quick way to compare visual structures. For anatomy-first work, use the [plant cell example](/plant-cell-labeled) as a reference for labels and leader lines. When the diagram needs to summarize an entire paper rather than one mechanism, the [graphical abstract page](/graphical-abstract-maker) offers a more narrative structure.',
        'When the structure is clear, open the [AI scientific figure generator](/generate) with a detailed prompt, sketch, or reference image. You can use the [SciDrawer home page](/) to explore how diagrams fit into a broader research-figure workflow, then return to the template library to refine the composition. Keeping the same terminology and visual language across figures makes a paper easier to read as a whole.',
      ],
      links: [
        { label: 'Browse diagram templates', href: '/templates' },
        {
          label: 'Open the plant cell labeled page',
          href: '/plant-cell-labeled',
        },
        {
          label: 'Create a graphical abstract',
          href: '/graphical-abstract-maker',
        },
        { label: 'Generate a custom scientific figure', href: '/generate' },
      ],
    },
  ],
  faqHeading: commonEn.faqHeading,
  faq: [
    {
      question: 'What can I make with a scientific diagram maker?',
      answer:
        'You can create starting points for mechanism diagrams, pathway diagrams, labeled structures, workflows, graphical abstracts, and other research visuals from a prompt, sketch, or reference image.',
    },
    {
      question: 'Can SciDrawer make mechanism diagrams?',
      answer:
        'Yes. Describe the entities, compartments, relationships, and direction of the mechanism. Always review the generated labels and causal arrows against your scientific sources.',
    },
    {
      question: 'Can I create a pathway diagram?',
      answer:
        'Yes. A prompt that names the starting event, intermediate stages, branches, feedback, and final outcome helps establish a readable pathway structure.',
    },
    {
      question: 'Can I make labeled diagrams?',
      answer:
        'Yes. You can specify the object and the labels you need, then refine leader lines, terminology, and layout before using the image in a paper or presentation.',
    },
    {
      question: 'Can I start with a sketch or reference image?',
      answer:
        'Yes. A sketch can communicate layout and relationships, while a reference image can communicate style or structure. Use either as guidance and verify the final scientific content.',
    },
    {
      question: 'Can I edit the result?',
      answer:
        'You can iterate with a revised prompt, sketch, or reference image and continue the design process in an editor or publication workflow for exact labels and final polishing.',
    },
    {
      question: 'Are generated diagrams ready to publish without review?',
      answer:
        'They are useful starting points, not a substitute for scientific review. Check every label, arrow, scale relationship, abbreviation, and conclusion before publication.',
    },
    {
      question: 'Can I use a scientific diagram in a Chinese paper?',
      answer:
        'Yes. Replace the labels with the terminology used in the paper, check font support and readability, and follow the journal or conference submission requirements.',
    },
    {
      question: 'Does the tool have free usage?',
      answer:
        'SciDrawer offers free usage so you can test the workflow. Current generation limits depend on the account and credit configuration.',
    },
  ],
  tryHeading: commonEn.tryHeading,
  tryParagraph:
    'Describe the mechanism, pathway, or labeled structure you need and let SciDrawer create a visual starting point. Bring a sketch or reference image when the layout matters, then check every scientific detail before export.',
  tryLabel: commonEn.tryLabel,
  relatedHeading: commonEn.relatedHeading,
  relatedDescription: commonEn.relatedDescription,
  relatedLinks: [
    { label: 'Graphical Abstract Maker', href: '/graphical-abstract-maker' },
    { label: 'Scientific Poster Maker', href: '/scientific-poster-maker' },
    { label: 'AI Scientific Figure Generator', href: '/generate' },
  ],
};

const scientificDiagramZh: SeoPageContent = {
  locale: 'zh',
  title: 'Scientific Diagram Maker - 用 AI 创建科研示意图 | SciDrawer',
  description:
    '通过文字提示词、草图或参考图制作适合发表的科研示意图，覆盖机制图、通路图和带标注的示意图，并提供可编辑模板。免费试用。',
  eyebrow: '科研示意图工作台',
  h1: 'Scientific Diagram Maker',
  intro:
    '从文字提示词、草图或参考图开始，创建适合论文使用的科研示意图，并针对研究故事调整视觉结构。',
  heroImage: '/imgs/showcase/mechanism-pathways.svg',
  heroImageAlt: '机制图和通路图科研示意图示例',
  breadcrumbHome: commonZh.breadcrumbHome,
  breadcrumbLibrary: commonZh.breadcrumbLibrary,
  breadcrumbCurrent: 'Scientific Diagram Maker',
  ctaLabel: '制作科研示意图',
  sections: [
    {
      heading: '什么是科研示意图？',
      paragraphs: [
        '科研示意图是对结构、机制、通路、工作流或研究关系进行视觉解释的图示。它比普通插画更强调科学含义：对象具有明确角色，箭头说明方向或关系，标签帮助读者把视觉模型与论文术语对应起来。它可以展示系统包含什么、过程如何随时间变化，或者多个组件如何互相作用。好的科研示意图会降低理解成本，但不会把科学内容简化成没有依据的装饰。',
        '研究者会在论文、图形摘要、海报、课程讲义、基金申请和实验室文档中使用示意图。统一的视觉语言可以帮助同一项研究在不同场景中保持术语和逻辑一致。SciDrawer 用来帮助你从文字描述或草图进入第一版构图，但在用于论文或正式演示之前，仍需由你检查科学准确性、比例、方向和标注。',
      ],
      links: [
        { label: '浏览科研示意图模板', href: '/templates' },
        { label: '打开 AI 生成器', href: '/generate' },
      ],
    },
    {
      heading: '常见的科研示意图类型',
      paragraphs: [
        '不同研究问题需要不同的视觉语法。在绘图前先确定类型，可以让读者更快知道应该关注什么，也能避免画面变成互不相关的图标集合。下面三类覆盖了许多常见场景，也可以在同一项研究中组合使用。',
      ],
      subsections: [
        {
          heading: '机制图（Mechanism Diagram）',
          paragraphs: [
            '机制图说明某种干预、相互作用或生物事件如何带来变化。可以用空间分区表示细胞膜、细胞质、细胞核、组织或设备层。箭头负责表达激活、运输、抑制或转化，短标签说明关键实体。如果研究问题关注的是高层次机制，就不必把每个分子都画出来；清楚的因果链通常比完整清单更有价值。',
          ],
        },
        {
          heading: '通路图（Pathway Diagram）',
          paragraphs: [
            '通路图强调顺序、分支、反馈或汇合，适合表现信号级联、代谢路径、实验流程、治疗反应和数据处理管线。先确定阅读方向，再统一箭头样式；有分支时让分支对齐，反馈关系则可以用不同线型或简短说明区分，避免大量线条穿过主体画面。',
          ],
        },
        {
          heading: '带标注的示意图（Labeled Diagram）',
          paragraphs: [
            '带标注的示意图用来识别结构、样本、设备或模型的组成部分。主体应保持稳定的中心位置，标注线尽量不交叉。可以按区域分组标签，缩短术语，并用小图例解释重复符号。[植物细胞标注图](/plant-cell-labeled) 展示了如何在保留清晰轮廓的同时放置多个细胞器标签。',
          ],
        },
      ],
    },
    {
      heading: '如何一步一步制作科研示意图？',
      paragraphs: [
        '高效的做法是在选择颜色和装饰之前，先把科学关系说清楚。无论你是从零绘图、修改模板，还是让 AI 先生成草稿，都可以使用下面的工作流。',
      ],
      subsections: [
        {
          heading: '确定核心结论和实体',
          paragraphs: [
            '先写出这张图要支持的一句话结论，再列出解释该结论所必需的实体，并按空间、阶段或角色分组。这样可以避免机制图变成术语表，也可以避免标签压住带标注结构的主体。在 [AI 生成器](/generate) 中明确写出实体、关系和阅读方向，通常能得到更有用的第一版构图。',
          ],
        },
        {
          heading: '选择布局语法',
          paragraphs: [
            '连续步骤适合从左到右或从上到下的流程，带标注结构适合中心主体加引线，依赖空间位置的机制则适合用分区或泳道表达。如果核心结论是两个条件的差异，可以使用对比式布局。浏览 [模板库](/templates)，可以看到固定网格、重复面板和统一间距如何帮助读者扫描复杂解释。',
          ],
        },
        {
          heading: '先画关系，再补细节',
          paragraphs: [
            '先放置主要对象和箭头，暂时隐藏标签，检查图是否仍然能被理解。随后只添加会改变解释的细节，例如受体、运输步骤、对照组、测量输出或关键结构标志。激活、抑制、移动和不确定性应该使用稳定的视觉词汇，不常见的符号则放进图例说明。',
          ],
        },
        {
          heading: '核对准确性并导出',
          paragraphs: [
            '逐项对照论文、文献或经过验证的实验流程，检查标签和箭头。注意图是否暗示了证据并未支持的比例、顺序或因果关系。在最终展示尺寸下检查可读性，再导出要求的格式并保留可编辑版本。如果示意图还要被整理成完整论文摘要，也可以参考 [图形摘要制作工具](/graphical-abstract-maker) 的叙事结构。',
          ],
        },
      ],
    },
    {
      heading: '科研示意图示例',
      paragraphs: [
        '示例的价值不只是模仿画面，而是观察视觉结构如何承担科学含义。下面的案例覆盖解剖结构、机制、通路和实验流程，每个案例都建立了主阅读路径，并让标签成为辅助解释，而不是全部内容。',
      ],
      examples: [
        {
          title: '植物细胞标注图',
          image: '/imgs/diagrams/plant-cell-labeled.svg',
          alt: '带有细胞器标签的植物细胞示意图',
          description:
            '中心细胞轮廓为标签提供稳定锚点，引线向外连接文字，避免文字遮挡细胞器。清晰的外轮廓让读者在阅读术语之前就能理解主体结构。',
        },
        {
          title: '机制与通路概览',
          image: '/imgs/showcase/mechanism-pathways.svg',
          alt: '机制和通路科研示意图示例',
          description:
            '横向排列的阶段和统一箭头清楚表达了方向，适合说明机制而不需要让读者解读大量交叉连线。',
        },
        {
          title: '微流控实验流程',
          image: '/imgs/generated/microfluidic-workflow.png',
          alt: '微流控实验室流程科研示意图',
          description:
            '重复的阶段和一致的面板间距把实验步骤压缩成易扫描的流程，读者先看到顺序，再通过短标注理解每一步发生了什么变化。',
        },
        {
          title: '细胞信号级联',
          image: '/imgs/generated/signaling-cascade.png',
          alt: '细胞信号级联机制图',
          description:
            '空间分区说明事件发生的位置，方向箭头解释从受体激活到细胞核反应的转变，分子细节服从于机制主线。',
        },
      ],
    },
    {
      heading: '科研示意图的常见错误',
      paragraphs: [
        '拥挤通常说明核心结论还没有被收窄。继续添加标签不能解决主要实体之间关系不清的问题。可以回到一句话结论，删除不改变解释的细节，并在两个故事竞争同一画面时拆成两张图。读者应该清楚什么是主体、什么是辅助信息，以及图的阅读从哪里开始、在哪里结束。',
        '另一个问题是符号不一致。同一张图中一个箭头如果表示激活，就不应在另一处无说明地表示移动。尤其要避免只依赖颜色，考虑打印和色觉差异带来的影响。小字号、低对比度、交叉引线和未解释的缩写，都会让科学正确的图变得难以使用。',
      ],
      bullets: [
        '不要在没有理由的情况下混用多种阅读方向。',
        '装饰性图标不能比清晰的科学符号更重要。',
        '检查每一条箭头是否都在解释一个关系或过程。',
        '确认标签与论文中的术语和缩写保持一致。',
      ],
    },
    {
      heading: '模板与相关图示工作流',
      paragraphs: [
        '当你知道需要哪一种解释、但不想重新搭建网格、标签体系和面板节奏时，可以从模板开始。[科研示意图模板](/templates) 方便比较不同视觉结构；解剖结构类工作可以参考 [植物细胞示例](/plant-cell-labeled) 的引线与标签；如果需要总结整篇论文而不是单个机制，[图形摘要页面](/graphical-abstract-maker) 会提供更偏叙事的结构。',
        '结构明确后，可以在 [AI 科研配图生成器](/generate) 中输入详细提示词、草图或参考图。通过 [SciDrawer 首页](/) 了解完整科研配图工作流，再回到模板库调整排版。让不同图示使用相同术语和视觉语言，可以提升整篇论文的阅读连贯性。',
      ],
      links: [
        { label: '浏览科研示意图模板', href: '/templates' },
        { label: '打开植物细胞标注图', href: '/plant-cell-labeled' },
        { label: '制作图形摘要', href: '/graphical-abstract-maker' },
        { label: '生成自定义科研图', href: '/generate' },
      ],
    },
  ],
  faqHeading: commonZh.faqHeading,
  faq: [
    {
      question: '科研示意图生成器可以制作什么？',
      answer:
        '可以从提示词、草图或参考图开始制作机制图、通路图、带标注结构图、实验流程图、图形摘要和其他科研视觉草稿。',
    },
    {
      question: 'SciDrawer 可以制作机制图吗？',
      answer:
        '可以。请描述实体、空间分区、相互关系和机制方向，生成后仍需对照科学资料检查标签与因果箭头。',
    },
    {
      question: '可以制作通路图吗？',
      answer:
        '可以。在提示词中写清起始事件、中间阶段、分支、反馈和最终结果，有助于建立可读的通路结构。',
    },
    {
      question: '可以制作带标注的示意图吗？',
      answer:
        '可以。说明主体和需要的标签后，再针对引线、术语和排版进行调整，然后用于论文或演示。',
    },
    {
      question: '可以从草图或参考图开始吗？',
      answer:
        '可以。草图适合表达布局和关系，参考图适合表达风格或结构；无论使用哪一种，都要核对最终科学内容。',
    },
    {
      question: '生成结果可以编辑吗？',
      answer:
        '可以继续用修改后的提示词、草图或参考图迭代，并在编辑器或出版工作流中完成精确标签和最终润色。',
    },
    {
      question: '生成的示意图可以不检查就直接发表吗？',
      answer:
        '不建议。生成结果是有用的起点，不代替科学审核；发表前应检查标签、箭头、比例、缩写和结论。',
    },
    {
      question: '中文论文可以使用科研示意图吗？',
      answer:
        '可以。把标签替换为论文术语，确认字体和可读性，并遵循目标期刊或会议的投稿要求。',
    },
    {
      question: '工具有免费额度吗？',
      answer:
        'SciDrawer 提供免费额度用于体验工作流，具体生成限制取决于当前账户和积分配置。',
    },
  ],
  tryHeading: commonZh.tryHeading,
  tryParagraph:
    '描述你需要的机制、通路或带标注结构，让 SciDrawer 生成一个视觉起点。布局重要时可以附上草图或参考图，并在导出前逐项检查科学细节。',
  tryLabel: commonZh.tryLabel,
  relatedHeading: commonZh.relatedHeading,
  relatedDescription: commonZh.relatedDescription,
  relatedLinks: [
    { label: '图形摘要制作工具', href: '/graphical-abstract-maker' },
    { label: 'Scientific Poster Maker', href: '/scientific-poster-maker' },
    { label: 'AI 科研配图生成器', href: '/generate' },
  ],
};

const scientificPosterEn: SeoPageContent = {
  locale: 'en',
  title:
    'Scientific Poster Maker - Create Research Posters with AI | SciDrawer',
  description:
    'Create a clear, publication-ready scientific poster from your study outline, diagrams, and results. Start with editable layouts or generate a visual draft with AI.',
  eyebrow: 'Research poster workflow',
  h1: 'Scientific Poster Maker',
  intro:
    'Plan a readable scientific poster from your research question, methods, figures, and results, then use AI to create a visual starting point.',
  heroImage: '/imgs/generated/how-it-works-organ-chip.png',
  heroImageAlt: 'Scientific research workflow illustration for a poster',
  breadcrumbHome: commonEn.breadcrumbHome,
  breadcrumbLibrary: commonEn.breadcrumbLibrary,
  breadcrumbCurrent: 'Scientific Poster Maker',
  ctaLabel: 'Create a scientific poster draft',
  sections: [
    {
      heading: 'What Is a Scientific Poster?',
      paragraphs: [
        'A scientific poster is a visual presentation of a research project designed to be read while people are standing, walking through a session, or discussing the work with the author. It combines a concise title, a short introduction, methods, key figures, results, and a conclusion into a hierarchy that can be scanned from a distance and read in detail up close. A research poster is not a paper pasted onto a large canvas. It is a guided conversation: the layout should tell a visitor where to begin, what evidence matters, and what question to ask next.',
        'A good scientific poster maker helps with the visual planning that happens before final typesetting. It can help you test a column structure, turn a dense method into a diagram, summarize the main result, and keep labels and colors consistent across sections. AI can accelerate the first draft, but the author still controls the data, wording, citations, statistical claims, and final export. Use the tool to explore structure and visual explanations, then validate every scientific statement before sharing the poster at a conference or online.',
      ],
      links: [
        { label: 'Browse research figure templates', href: '/templates' },
        { label: 'Generate a figure for your poster', href: '/generate' },
      ],
    },
    {
      heading: 'What Makes a Research Poster Readable?',
      paragraphs: [
        'Poster instructions vary by conference, department, and venue, so check the current template and submission guide first. As a general practice, choose the final canvas size and orientation before arranging content, leave enough whitespace around each block, and make the title and central finding visible from the expected viewing distance. A clear grid is more useful than a decorative background. Use headings to create a predictable route through the project, and give the most important result the strongest position and visual weight.',
        'Typography and figure quality matter as much as the text itself. Use a type size that can be read in person, keep line lengths short, and avoid filling every available space. Figures need enough resolution for the final canvas, with legends and annotations that remain legible when printed. Use color to group related information, not as a substitute for labels. These are general guidelines rather than a rule for a particular conference; confirm exact dimensions, file formats, accessibility requirements, and printing instructions with the organizer.',
      ],
      bullets: [
        'Set the required dimensions and orientation before designing the layout.',
        'Use a grid, generous margins, and short text blocks to support scanning.',
        'Make the research question and main finding easy to locate.',
        'Check figure resolution, contrast, font support, and color accessibility.',
      ],
    },
    {
      heading: 'How to Make a Scientific Poster, Step by Step',
      paragraphs: [
        'A poster becomes easier to design when the research story is reduced to a few decisions. The steps below help you organize the content before polishing the visual style.',
      ],
      subsections: [
        {
          heading: 'Write the one-minute story',
          paragraphs: [
            'Write the research question, the method that answers it, and the result that the visitor should remember. This short story becomes the poster’s visual spine. Keep background information only when it explains why the question matters. If the project has several results, select the one that best supports the poster’s stated claim and move secondary findings to a small supporting area or a linked paper.',
          ],
        },
        {
          heading: 'Choose a poster structure',
          paragraphs: [
            'A column layout works well for a conventional introduction-methods-results-conclusion flow. A story-board layout can be better for a multi-stage experiment, while a central-result layout gives one major figure the role of the visual anchor. Explore the [template library](/templates) before placing every paragraph. The right structure should make the project’s logic obvious even when someone reads only the headings and figures.',
          ],
        },
        {
          heading: 'Turn methods and results into visuals',
          paragraphs: [
            'Replace long procedural descriptions with a workflow, mechanism diagram, or labeled structure when a visual can communicate the relationship faster. Use one chart or figure to answer one question, and write a short takeaway beside it. A prompt, sketch, or reference image can help the [AI generator](/generate) create a starting diagram, but numerical charts, statistical annotations, and final labels should be checked or rebuilt from the source data.',
          ],
        },
        {
          heading: 'Review, export, and test the poster',
          paragraphs: [
            'Read the poster from several distances and ask a colleague to summarize it in one minute. Check that figures are sharp, captions are understandable, citations are present, and the conclusion does not overstate the evidence. Export the requested format and inspect the generated PDF or image at the actual print scale. Keep an editable version so you can fix a label or adapt the work for a slide, paper, or graphical abstract.',
          ],
        },
      ],
    },
    {
      heading: 'Scientific Poster Examples',
      paragraphs: [
        'The examples below are research visuals that can become poster anchors. Each one illustrates a different way to reduce complexity: a sequence of panels, a mechanism, a labeled structure, or a laboratory workflow. On a poster, give the anchor figure enough space to be understood without competing with every other element on the canvas.',
      ],
      examples: [
        {
          title: 'Mechanism analysis',
          image: '/imgs/hero/mechanism-analysis.png',
          alt: 'Scientific mechanism analysis figure for a research poster',
          description:
            'A mechanism figure can serve as the central explanation when the poster is organized around how an intervention produces a biological response. Use compartments and arrows to show the logic, then keep the caption focused on the finding.',
        },
        {
          title: 'Organ-chip workflow',
          image: '/imgs/generated/how-it-works-organ-chip.png',
          alt: 'Organ-chip workflow figure for a scientific poster',
          description:
            'A workflow is useful when the contribution is a sequence of fabrication, treatment, measurement, and analysis steps. Repeated panels help visitors locate their place in the process quickly.',
        },
        {
          title: 'Plant cell labeled diagram',
          image: '/imgs/diagrams/plant-cell-labeled.svg',
          alt: 'Plant cell labeled diagram used as a poster visual',
          description:
            'A labeled structure can support an introduction, teaching poster, or methods explanation. Keep the central object large enough to read, and use grouped callouts instead of filling the margins with disconnected labels.',
        },
      ],
    },
    {
      heading: 'Common Scientific Poster Mistakes',
      paragraphs: [
        'The most common failure is trying to fit the entire manuscript onto the poster. Long paragraphs, tiny captions, and repeated background details force the visitor to stand too close and make the main result hard to find. Cut text before shrinking type. Use a figure, a short takeaway, or a spoken explanation for details that do not need to be read during the first pass. A poster should invite a conversation, not attempt to replace the full paper.',
        'Visual inconsistency can create a second layer of confusion. Different figures may use different terms, arrow styles, color meanings, and levels of detail. Establish a small visual system and apply it across the canvas. Test the design in grayscale, check contrast, and make sure the conclusion agrees with the abstract and source data. A clean poster that says one thing clearly is more persuasive than a crowded poster that says everything at once.',
      ],
      bullets: [
        'Do not solve an overflow problem by making every font smaller.',
        'Do not use decorative backgrounds that reduce figure contrast.',
        'Do not give every result equal visual weight when one is the main claim.',
        'Do not publish generated labels or values without checking the source material.',
      ],
    },
    {
      heading: 'Templates to Start From',
      paragraphs: [
        'Start with the [scientific figure templates](/templates) when you need a visual language for a method, mechanism, or result before building the whole poster. A [plant cell labeled diagram](/plant-cell-labeled) can supply a clear anatomy layout, while the [graphical abstract maker](/graphical-abstract-maker) helps when the poster needs a compact question-method-finding summary. You can then use the [AI figure generator](/generate) to create an original figure from the details of your study.',
        'The [SciDrawer home page](/) brings these workflows together for papers, posters, and presentations. Keep a copy of the poster source, exported figures, and final text separately so the work can be revised for another conference or adapted into a manuscript figure. Before sending the file to print, compare it with the event’s latest instructions rather than relying on a previous poster size or template.',
      ],
      links: [
        { label: 'Explore templates', href: '/templates' },
        { label: 'Open the plant cell example', href: '/plant-cell-labeled' },
        {
          label: 'Make a graphical abstract',
          href: '/graphical-abstract-maker',
        },
        { label: 'Generate a custom research figure', href: '/generate' },
        { label: 'Visit SciDrawer home', href: '/' },
      ],
    },
  ],
  faqHeading: commonEn.faqHeading,
  faq: [
    {
      question: 'Can I make a scientific poster for free?',
      answer:
        'You can use SciDrawer’s free usage to explore the workflow and create starting visuals. Paid plans provide additional credits when you need more iterations or higher-volume generation.',
    },
    {
      question: 'Can SciDrawer create the entire poster for me?',
      answer:
        'SciDrawer is best used to plan the visual structure and create research figures or drafts. You should assemble the final poster, confirm the data and wording, and follow the event’s submission requirements.',
    },
    {
      question: 'Can I edit the poster and its figures?',
      answer:
        'Yes. Use generated images and templates as starting points, then edit the layout, text, labels, charts, citations, and visual hierarchy in your preferred design or presentation workflow.',
    },
    {
      question: 'What size should a scientific poster be?',
      answer:
        'There is no single universal size. Confirm the required dimensions and orientation with the conference, institution, or printer before designing and exporting.',
    },
    {
      question: 'Can I use a sketch or reference image?',
      answer:
        'Yes. A sketch or reference image can guide the composition of a figure. Always verify that the resulting scientific content and labels match your source material.',
    },
    {
      question: 'Can I use the poster for a Chinese conference?',
      answer:
        'Yes. Replace the copy with the conference’s preferred Chinese terminology, verify font support and readability, and follow its current size, format, and accessibility instructions.',
    },
    {
      question: 'How long does it take to make a research poster?',
      answer:
        'A structured first draft can take a few hours when the figures and story are ready. Allow additional time for editing, data checks, proofreading, printing tests, and feedback.',
    },
    {
      question: 'Can I export high-resolution figures for printing?',
      answer:
        'SciDrawer can provide high-resolution starting images. Check the printer or conference requirements for final dimensions, resolution, color mode, and file format.',
    },
    {
      question: 'Are AI-generated poster figures automatically accurate?',
      answer:
        'No. Generated figures require author review. Check every label, number, arrow, relationship, and claim against your data and manuscript before use.',
    },
  ],
  tryHeading: commonEn.tryHeading,
  tryParagraph:
    'Start with the question and result your poster needs to communicate. Use SciDrawer to create a figure draft from a prompt, sketch, or reference image, then assemble and verify the final poster for your event.',
  tryLabel: commonEn.tryLabel,
  relatedHeading: commonEn.relatedHeading,
  relatedDescription: commonEn.relatedDescription,
  relatedLinks: [
    { label: 'Graphical Abstract Maker', href: '/graphical-abstract-maker' },
    { label: 'Scientific Diagram Maker', href: '/scientific-diagram-maker' },
    { label: 'AI Scientific Figure Generator', href: '/generate' },
  ],
};

const scientificPosterZh: SeoPageContent = {
  locale: 'zh',
  title: 'Scientific Poster Maker - 用 AI 创建科研海报 | SciDrawer',
  description:
    '根据研究提纲、示意图和结果制作清晰、适合发表的科研海报。支持从可编辑布局开始，或用 AI 生成视觉草稿。',
  eyebrow: '科研海报工作流',
  h1: 'Scientific Poster Maker',
  intro:
    '围绕研究问题、方法、图示和结果规划可读的科研海报，再用 AI 快速创建视觉起点。',
  heroImage: '/imgs/generated/how-it-works-organ-chip.png',
  heroImageAlt: '用于科研海报的实验流程插图',
  breadcrumbHome: commonZh.breadcrumbHome,
  breadcrumbLibrary: commonZh.breadcrumbLibrary,
  breadcrumbCurrent: 'Scientific Poster Maker',
  ctaLabel: '创建科研海报草稿',
  sections: [
    {
      heading: '什么是科研海报？',
      paragraphs: [
        '科研海报是一种在会议现场、展览走廊或线上展示研究项目的视觉形式。它把简短标题、研究背景、方法、关键图示、结果和结论组织在一个层级清晰的画布中，让路过的人可以先远距离扫描，再近距离阅读。科研海报不是把论文全文放大贴到画布上，而是一场由排版引导的对话：读者应该知道从哪里开始、哪些证据最重要，以及接下来应该问什么。',
        '好的科研海报工具可以帮助你在最终排版之前完成视觉规划，例如测试栏目结构、把冗长方法变成流程图、突出主要结果，并让全图的标签和颜色保持一致。AI 可以加快第一版构图，但数据、文字、引用、统计结论和最终导出仍应由作者控制。可以用工具探索结构和视觉解释，之后逐项核对科学陈述，再用于会议或线上展示。',
      ],
      links: [
        { label: '浏览科研图示模板', href: '/templates' },
        { label: '为海报生成科研图', href: '/generate' },
      ],
    },
    {
      heading: '什么样的科研海报更容易阅读？',
      paragraphs: [
        '不同会议、院系和场地的要求并不相同，因此应先查看最新模板和投稿说明。一般来说，要在排版前确定画布尺寸和方向，给每个信息块留下足够留白，并让标题和核心发现在预期观看距离下可见。清晰的网格比装饰性背景更有用。使用小标题建立稳定阅读路线，让最重要的结果获得最明显的位置和视觉权重。',
        '字体和图片质量与文字本身同样重要。字号要能在现场阅读，段落长度应尽量短，避免把空间填满。图示需要适合最终画布的分辨率，图例和标注在印刷后仍然清楚。用颜色组织相关信息，而不要让颜色代替标签。以上是通用建议，不代表某个会议的规定，具体尺寸、格式、无障碍和打印要求仍应向主办方确认。',
      ],
      bullets: [
        '在设计前设置要求的尺寸和方向。',
        '使用网格、足够边距和短文本块支持快速扫描。',
        '让研究问题和主要发现容易被找到。',
        '检查图片分辨率、对比度、字体支持和色彩可访问性。',
      ],
    },
    {
      heading: '如何一步一步制作科研海报？',
      paragraphs: [
        '当研究故事被压缩成几个关键决定后，海报会更容易设计。下面的步骤可以帮助你在润色视觉风格之前先组织内容。',
      ],
      subsections: [
        {
          heading: '写出一分钟故事',
          paragraphs: [
            '写出研究问题、回答问题的方法，以及希望访客记住的结果。这段短故事就是海报的视觉主轴。背景信息只有在能解释问题为什么重要时才保留。如果项目有多个结果，选择最能支持海报主张的一个，其余发现可以放在辅助区域或论文链接中。',
          ],
        },
        {
          heading: '选择海报结构',
          paragraphs: [
            '传统的介绍—方法—结果—结论适合使用栏目式布局；多阶段实验可以使用分镜式布局；如果有一个核心结果，则可以使用中心结果式结构。先浏览 [模板库](/templates)，再放入大段文字。合适的结构应该让读者只看小标题和图示也能理解项目逻辑。',
          ],
        },
        {
          heading: '把方法和结果变成视觉图',
          paragraphs: [
            '如果流程图、机制图或带标注结构能够更快表达关系，就用视觉图替代长段程序说明。一张图尽量回答一个问题，并在旁边配一条简短结论。提示词、草图或参考图可以帮助 [AI 生成器](/generate) 创建示意图起点，但数值图表、统计标注和最终标签应根据原始数据检查或重新制作。',
          ],
        },
        {
          heading: '检查、导出并测试海报',
          paragraphs: [
            '在多个距离阅读海报，请同事用一分钟复述内容。检查图片是否清晰、图注是否易懂、引用是否完整，结论是否超出证据。按要求导出后，在实际打印比例下检查 PDF 或图片，并保留可编辑版本，方便修正标签或改造成幻灯片、论文图和图形摘要。',
          ],
        },
      ],
    },
    {
      heading: '科研海报示例',
      paragraphs: [
        '下面的案例可以作为海报的核心视觉图。它们分别展示了如何用面板流程、机制关系、带标注结构和实验工作流降低复杂度。在海报中，应给核心图足够空间，避免它被画布上的其他元素分散。',
      ],
      examples: [
        {
          title: '机制分析',
          image: '/imgs/hero/mechanism-analysis.png',
          alt: '用于科研海报的机制分析图',
          description:
            '当海报围绕干预如何产生生物反应展开时，机制图可以承担核心解释功能。用空间分区和箭头表达逻辑，再把图注聚焦于发现。',
        },
        {
          title: '器官芯片流程',
          image: '/imgs/generated/how-it-works-organ-chip.png',
          alt: '用于科研海报的器官芯片流程图',
          description:
            '当贡献是一系列制备、处理、测量和分析步骤时，流程图很有用。重复面板让访客快速找到自己在流程中的位置。',
        },
        {
          title: '植物细胞标注图',
          image: '/imgs/diagrams/plant-cell-labeled.svg',
          alt: '作为科研海报视觉图的植物细胞标注图',
          description:
            '带标注结构可以用于背景介绍、教学海报或方法解释。主体应足够大，边缘用分组引线，而不是填满互不关联的标签。',
        },
      ],
    },
    {
      heading: '科研海报的常见错误',
      paragraphs: [
        '最常见的问题是试图把整篇论文塞进海报。长段落、过小图注和重复背景会迫使访客靠得很近，也让主要结果难以找到。文字溢出时先删减，而不是把全部字号缩小。可以用图示、短结论或现场讲解承载不必在第一轮阅读中出现的细节。海报应该邀请对话，而不是替代完整论文。',
        '视觉不一致会带来第二层困惑。不同图示可能使用不同术语、箭头、颜色含义和细节层级。先建立一个小型视觉系统，再应用到整张画布。用灰度测试，检查对比度，并确认结论与摘要和原始数据一致。清楚说一件事的简洁海报，通常比同时说所有事情的拥挤海报更有说服力。',
      ],
      bullets: [
        '不要用缩小所有字号来解决内容溢出。',
        '不要使用降低图示对比度的装饰性背景。',
        '不要让每个结果都获得相同的视觉权重。',
        '不要在未核对源材料的情况下直接使用生成的标签或数值。',
      ],
    },
    {
      heading: '从模板开始制作',
      paragraphs: [
        '当你需要为方法、机制或结果建立视觉语言时，可以先使用 [科研图示模板](/templates)，不必一开始就搭建完整海报。[植物细胞标注图](/plant-cell-labeled) 可以提供清晰的结构布局，[图形摘要制作工具](/graphical-abstract-maker) 适合需要概括问题、方法和发现的场景。之后可以使用 [AI 科研配图生成器](/generate) 根据研究细节制作原创图示。',
        '[SciDrawer 首页](/) 汇总了论文、海报和演示文稿的工作流。建议分别保存海报源文件、导出图和最终文字，方便适配另一个会议或改造成论文图。打印前要重新对照活动的最新说明，不要直接沿用上一次的尺寸或模板。',
      ],
      links: [
        { label: '浏览模板', href: '/templates' },
        { label: '打开植物细胞示例', href: '/plant-cell-labeled' },
        { label: '制作图形摘要', href: '/graphical-abstract-maker' },
        { label: '生成自定义科研图', href: '/generate' },
        { label: '访问 SciDrawer 首页', href: '/' },
      ],
    },
  ],
  faqHeading: commonZh.faqHeading,
  faq: [
    {
      question: '可以免费制作科研海报吗？',
      answer:
        '可以使用 SciDrawer 的免费额度体验工作流并制作视觉起点。需要更多迭代或批量生成时，可以选择提供更多积分的付费方案。',
    },
    {
      question: 'SciDrawer 可以自动完成整张海报吗？',
      answer:
        'SciDrawer 更适合规划视觉结构和生成科研图示或草稿。最终海报仍应由你组装、核对数据和文字，并遵循活动的投稿要求。',
    },
    {
      question: '海报和图示可以编辑吗？',
      answer:
        '可以。把生成图和模板作为起点，再在熟悉的设计或演示工作流中修改布局、文字、标签、图表、引用和视觉层级。',
    },
    {
      question: '科研海报应该使用多大尺寸？',
      answer:
        '没有一个通用尺寸。请在设计和导出前向会议、院系或打印方确认尺寸和方向。',
    },
    {
      question: '可以使用草图或参考图吗？',
      answer:
        '可以。草图或参考图可以指导图示构图，但生成结果中的科学内容和标签仍需与源材料核对。',
    },
    {
      question: '可以用于中文会议吗？',
      answer:
        '可以。替换为会议偏好的中文术语，确认字体支持和可读性，并遵循活动最新的尺寸、格式和无障碍说明。',
    },
    {
      question: '制作一张科研海报需要多久？',
      answer:
        '当图示和研究故事已经准备好时，结构化初稿可能需要几个小时。还要为编辑、数据核对、校对、打印测试和反馈留出时间。',
    },
    {
      question: '可以导出用于打印的高分辨率图示吗？',
      answer:
        'SciDrawer 可以提供高分辨率起始图。最终导出前，请确认打印方或会议要求的尺寸、分辨率、色彩模式和文件格式。',
    },
    {
      question: 'AI 生成的海报图示自动准确吗？',
      answer:
        '不一定。生成图需要作者审核，使用前应根据数据和论文检查每一个标签、数字、箭头、关系和结论。',
    },
  ],
  tryHeading: commonZh.tryHeading,
  tryParagraph:
    '先明确海报要表达的问题和结果，再用 SciDrawer 从提示词、草图或参考图制作视觉草稿，最后针对会议要求组装并核对完整海报。',
  tryLabel: commonZh.tryLabel,
  relatedHeading: commonZh.relatedHeading,
  relatedDescription: commonZh.relatedDescription,
  relatedLinks: [
    { label: '图形摘要制作工具', href: '/graphical-abstract-maker' },
    { label: 'Scientific Diagram Maker', href: '/scientific-diagram-maker' },
    { label: 'AI 科研配图生成器', href: '/generate' },
  ],
};

// Shared model instructions for the graphical-abstract preset. Kept in English
// for both locales; labels follow the language of the user's summary.
const graphicalAbstractToolPrompt = {
  prefix:
    'Create a publication-ready graphical abstract for a journal article. Clean flat vector scientific illustration style, white background, consistent restrained color palette, clear visual hierarchy that reads in a few seconds, short on-figure labels only (no paragraphs), no journal logos, no watermark. Write all labels in the same language as the study summary.',
  layouts: {
    flow: 'Three panels read left to right with arrows between them: (1) the research question or background, (2) the method or experimental approach, (3) the key finding and its implication. The key finding panel is the visual focus.',
    mechanism:
      'A central mechanism or model in the middle of the canvas, with the input or intervention on the left and the downstream effects or outcomes arranged around it, connected by arrows.',
    comparison:
      'Side-by-side comparison: control or baseline condition on the left, treatment or new condition on the right, with the key difference highlighted and a one-line takeaway at the bottom.',
  },
};

const graphicalAbstractToolEn: SeoTool = {
  heading: 'Make your graphical abstract',
  description:
    'Paste your abstract or key findings, pick a layout, and SciDrawer drafts the figure in the generator.',
  inputLabel: 'Your abstract or key findings',
  inputPlaceholder:
    'e.g. We show that drug X reduces tumor growth in mice by blocking the Y signaling pathway, measured by imaging and RNA-seq...',
  exampleLabel: 'Use an example',
  exampleText:
    'Chronic inflammation in adipose tissue drives insulin resistance. Using single-cell RNA-seq of mouse adipose tissue, we found that macrophage-derived IL-1β suppresses insulin signaling in adipocytes. Blocking IL-1β restored glucose tolerance in obese mice.',
  layoutLabel: 'Layout',
  layouts: [
    {
      id: 'flow',
      label: 'Question → Method → Finding',
      description: 'Three panels, left to right',
      prompt: graphicalAbstractToolPrompt.layouts.flow,
    },
    {
      id: 'mechanism',
      label: 'Central mechanism',
      description: 'Model in the middle, effects around it',
      prompt: graphicalAbstractToolPrompt.layouts.mechanism,
    },
    {
      id: 'comparison',
      label: 'Before / after',
      description: 'Control vs. treatment side by side',
      prompt: graphicalAbstractToolPrompt.layouts.comparison,
    },
  ],
  aspectLabel: 'Canvas',
  aspects: [
    { value: '16:9', label: 'Landscape 16:9' },
    { value: '4:3', label: 'Standard 4:3' },
    { value: '1:1', label: 'Square 1:1' },
  ],
  defaultAspect: '16:9',
  submitLabel: 'Generate graphical abstract',
  emptyError: 'Paste your abstract or key findings first.',
  note: 'Opens the generator with your settings filled in. Free to try after sign-up.',
  promptPrefix: graphicalAbstractToolPrompt.prefix,
};

const graphicalAbstractToolZh: SeoTool = {
  heading: '生成你的图形摘要',
  description:
    '粘贴摘要或核心发现，选一个版式，SciDrawer 会在生成器里帮你画出初稿。',
  inputLabel: '论文摘要或核心发现',
  inputPlaceholder:
    '例如：我们发现药物 X 通过阻断 Y 信号通路抑制小鼠肿瘤生长，并用成像和 RNA-seq 进行了验证……',
  exampleLabel: '填入示例',
  exampleText:
    '脂肪组织慢性炎症会导致胰岛素抵抗。我们对小鼠脂肪组织进行单细胞 RNA 测序，发现巨噬细胞分泌的 IL-1β 会抑制脂肪细胞的胰岛素信号。阻断 IL-1β 可恢复肥胖小鼠的葡萄糖耐量。',
  layoutLabel: '版式',
  layouts: [
    {
      id: 'flow',
      label: '问题 → 方法 → 结论',
      description: '三栏，从左到右',
      prompt: graphicalAbstractToolPrompt.layouts.flow,
    },
    {
      id: 'mechanism',
      label: '中心机制',
      description: '机制居中，效应环绕',
      prompt: graphicalAbstractToolPrompt.layouts.mechanism,
    },
    {
      id: 'comparison',
      label: '对照 / 处理',
      description: '左右对比',
      prompt: graphicalAbstractToolPrompt.layouts.comparison,
    },
  ],
  aspectLabel: '画布',
  aspects: [
    { value: '16:9', label: '横版 16:9' },
    { value: '4:3', label: '标准 4:3' },
    { value: '1:1', label: '方形 1:1' },
  ],
  defaultAspect: '16:9',
  submitLabel: '生成图形摘要',
  emptyError: '请先粘贴摘要或核心发现。',
  note: '会带着你的设置打开生成器，注册后可免费试用。',
  promptPrefix: graphicalAbstractToolPrompt.prefix,
};

const pageContent: Record<
  | 'graphical-abstract-maker'
  | 'scientific-diagram-maker'
  | 'scientific-poster-maker',
  Record<SeoLocale, SeoPageContent>
> = {
  'graphical-abstract-maker': {
    en: { ...graphicalAbstractEn, tool: graphicalAbstractToolEn },
    zh: { ...graphicalAbstractZh, tool: graphicalAbstractToolZh },
  },
  'scientific-diagram-maker': {
    en: scientificDiagramEn,
    zh: scientificDiagramZh,
  },
  'scientific-poster-maker': { en: scientificPosterEn, zh: scientificPosterZh },
};

export type SeoPageSlug = keyof typeof pageContent;

export function getSeoPageContent(
  slug: SeoPageSlug,
  locale: string
): SeoPageContent {
  return pageContent[slug][locale === 'zh' ? 'zh' : 'en'];
}

export function buildSeoPageJsonLd(
  content: SeoPageContent,
  canonical: string,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}/#scidrawer`,
        name: 'SciDrawer',
        url: canonical,
        description: content.description,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        inLanguage: content.locale,
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: content.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}
