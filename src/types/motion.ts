export type CategoryId =
  | 'all'
  | 'opening'
  | 'touch'
  | 'toggle'
  | 'scroll'
  | 'typography'
  | 'atmosphere'
  | 'feedback';

export interface CategoryDef {
  id: CategoryId;
  label: string;
}

export interface MotionItem {
  id: string;
  category: Exclude<CategoryId, 'all'>;
  jaName: string;
  enName: string;
  summary: string;
  pros: string;
  cons: string;
  recommendedPlace: string;
  aiPrompt: string;
}

export type GlossaryTermId =
  | 'header'
  | 'nav'
  | 'hero'
  | 'section'
  | 'card'
  | 'button'
  | 'text-link'
  | 'footer'
  | 'pages'
  | 'scroll'
  | 'hover'
  | 'loading';

export interface GlossaryTerm {
  id: GlossaryTermId;
  title: string;
  subtitle: string;
  aliases: string[];
  description: string;
  tip: string;
}
