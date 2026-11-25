import { Fragment } from 'react';
import { GLOSSARY_TERMS } from '../data/glossary';
import type { GlossaryTermId } from '../types/motion';

interface TermLinkedTextProps {
  text: string;
  onSelectTerm: (termId: GlossaryTermId) => void;
  tabIndex?: number;
}

// Build a sorted list of (alias -> termId) longest-first to avoid partial overlaps
const ALIAS_ENTRIES: Array<{ alias: string; termId: GlossaryTermId }> = GLOSSARY_TERMS.flatMap((term) =>
  term.aliases.map((alias) => ({ alias, termId: term.id })),
).sort((a, b) => b.alias.length - a.alias.length);

const ESCAPED_PATTERN = ALIAS_ENTRIES.map((e) =>
  e.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
).join('|');

const TERM_REGEX = new RegExp(`(${ESCAPED_PATTERN})`, 'g');
const ALIAS_TO_ID = new Map(ALIAS_ENTRIES.map((e) => [e.alias, e.termId]));

export function TermLinkedText({ text, onSelectTerm, tabIndex = 0 }: TermLinkedTextProps) {
  const parts = text.split(TERM_REGEX);

  return (
    <>
      {parts.map((part, idx) => {
        const termId = ALIAS_TO_ID.get(part);
        if (!termId) {
          return <Fragment key={idx}>{part}</Fragment>;
        }
        return (
          <button
            key={idx}
            type="button"
            className="term-auto-link"
            tabIndex={tabIndex}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTerm(termId);
            }}
            title={`「${part}」の場所を図解で見る`}
          >
            {part}
          </button>
        );
      })}
    </>
  );
}
