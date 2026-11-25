import { useRef, useState } from 'react';
import { Check, Copy, Info, RotateCw, Star } from 'lucide-react';
import type { GlossaryTermId, MotionItem } from '../types/motion';
import { MotionDemo } from './MotionDemo';
import { TermLinkedText } from './TermLinkedText';
import './MotionCard.css';

interface MotionCardProps {
  motion: MotionItem;
  isSelected: boolean;
  developerMode?: boolean;
  onToggleSelect: (id: string) => void;
  onOpenGlossary: (termId?: GlossaryTermId) => void;
}

export function MotionCard({
  motion,
  isSelected,
  developerMode = false,
  onToggleSelect,
  onOpenGlossary,
}: MotionCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);
  const copyTimerRef = useRef<number | null>(null);

  const handleCopyAiPrompt = async () => {
    try {
      await navigator.clipboard.writeText(motion.aiPrompt);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = motion.aiPrompt;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    setCopiedAi(true);
    if (copyTimerRef.current) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedAi(false);
    }, 2000);
  };

  return (
    <article
      className={`motion-card ${isFlipped ? 'motion-card--flipped' : ''} ${
        isSelected ? 'motion-card--selected' : ''
      } ${developerMode ? 'motion-card--dev' : ''}`}
    >
      <div className="motion-card__inner">
        {/* Front Side: Demo */}
        <div
          className={`motion-card__face motion-card__face--front ${
            isFlipped ? 'motion-card__face--inactive' : ''
          }`}
          aria-hidden={isFlipped}
        >
          <MotionDemo
            motionId={motion.id}
            category={motion.category}
            disabled={isFlipped}
          />

          <div className="motion-card__body">
            <div className="motion-card__title-row">
              <h2 className="motion-card__ja">{motion.jaName}</h2>
              <span className="motion-card__en">{motion.enName}</span>
            </div>
            <p className="motion-card__summary">{motion.summary}</p>
          </div>

          <div className="motion-card__actions">
            <button
              type="button"
              className="motion-card__flip-btn"
              onClick={() => setIsFlipped(true)}
              tabIndex={isFlipped ? -1 : 0}
            >
              <Info size={13} />
              メリット・注意点
            </button>
            <button
              type="button"
              className={`motion-card__star-btn ${
                isSelected ? 'motion-card__star-btn--active' : ''
              }`}
              onClick={() => onToggleSelect(motion.id)}
              aria-pressed={isSelected}
              tabIndex={isFlipped ? -1 : 0}
            >
              <Star size={13} fill={isSelected ? 'currentColor' : 'none'} />
              {isSelected ? '選んだ' : '気になる'}
            </button>
          </div>

          {developerMode && (
            <div className="motion-card__dev-bar">
              <button
                type="button"
                className={`motion-card__ai-copy-btn ${
                  copiedAi ? 'motion-card__ai-copy-btn--copied' : ''
                }`}
                onClick={handleCopyAiPrompt}
                tabIndex={isFlipped ? -1 : 0}
              >
                {copiedAi ? <Check size={12} /> : <Copy size={12} />}
                {copiedAi ? 'AI指示文をコピーしました' : 'AI指示文コピー'}
              </button>
            </div>
          )}
        </div>

        {/* Back Side: Explanation */}
        <div
          className={`motion-card__face motion-card__face--back ${
            !isFlipped ? 'motion-card__face--inactive' : ''
          }`}
          aria-hidden={!isFlipped}
        >
          <div className="motion-card__back-header">
            <div className="motion-card__title-row">
              <h2 className="motion-card__ja">{motion.jaName}</h2>
              <span className="motion-card__en">{motion.enName}</span>
            </div>
          </div>

          <div className="motion-card__back-list">
            <div className="motion-card__point">
              <div className="motion-card__point-label">◎ 良いところ</div>
              <p className="motion-card__point-text">
                <TermLinkedText
                  text={motion.pros}
                  onSelectTerm={onOpenGlossary}
                  tabIndex={isFlipped ? 0 : -1}
                />
              </p>
            </div>

            <div className="motion-card__point">
              <div className="motion-card__point-label motion-card__point-label--warn">
                △ 気をつけたい点
              </div>
              <p className="motion-card__point-text">
                <TermLinkedText
                  text={motion.cons}
                  onSelectTerm={onOpenGlossary}
                  tabIndex={isFlipped ? 0 : -1}
                />
              </p>
            </div>

            <div className="motion-card__point">
              <div className="motion-card__point-label motion-card__point-label--place">
                おすすめの場所
              </div>
              <p className="motion-card__point-text">
                <TermLinkedText
                  text={motion.recommendedPlace}
                  onSelectTerm={onOpenGlossary}
                  tabIndex={isFlipped ? 0 : -1}
                />
              </p>
            </div>
          </div>

          <div className="motion-card__back-footer">
            <div className="motion-card__actions motion-card__actions--back">
              <button
                type="button"
                className="motion-card__flip-btn"
                onClick={() => setIsFlipped(false)}
                tabIndex={!isFlipped ? -1 : 0}
              >
                <RotateCw size={13} />
                表に戻る
              </button>
              <button
                type="button"
                className={`motion-card__star-btn ${
                  isSelected ? 'motion-card__star-btn--active' : ''
                }`}
                onClick={() => onToggleSelect(motion.id)}
                aria-pressed={isSelected}
                tabIndex={!isFlipped ? -1 : 0}
              >
                <Star size={13} fill={isSelected ? 'currentColor' : 'none'} />
                {isSelected ? '選んだ' : '気になる'}
              </button>
            </div>
            <button
              type="button"
              className="motion-card__glossary-hint"
              onClick={() => onOpenGlossary()}
              tabIndex={!isFlipped ? -1 : 0}
            >
              ※場所の名前は図解で確認できます
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
