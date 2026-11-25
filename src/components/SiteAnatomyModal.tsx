import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';
import type { GlossaryTermId } from '../types/motion';
import './SiteAnatomyModal.css';

interface SiteAnatomyModalProps {
  isOpen: boolean;
  activeTermId: GlossaryTermId;
  onSelectTerm: (termId: GlossaryTermId) => void;
  onClose: () => void;
}

export function SiteAnatomyModal({
  isOpen,
  activeTermId,
  onSelectTerm,
  onClose,
}: SiteAnatomyModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  const [flashTick, setFlashTick] = useState(0);
  const [toastTitle, setToastTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setToastTitle(null);
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setFlashTick((t) => t + 1);
  }, [isOpen, activeTermId]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const activeTerm =
    GLOSSARY_TERMS.find((t) => t.id === activeTermId) ?? GLOSSARY_TERMS[0];

  const showSelectionToast = (title: string) => {
    setToastTitle(title);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastTitle(null);
      toastTimerRef.current = null;
    }, 4500);
  };

  const handleSelect = (termId: GlossaryTermId) => {
    const targetTerm = GLOSSARY_TERMS.find((t) => t.id === termId);
    if (termId === activeTermId) {
      setFlashTick((t) => t + 1);
    } else {
      onSelectTerm(termId);
    }
    if (targetTerm) {
      showSelectionToast(targetTerm.title);
    }
  };

  const scrollToDetail = () => {
    setToastTitle(null);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }

    const bodyEl = bodyRef.current;
    const detailEl = detailRef.current;
    if (!bodyEl || !detailEl) return;

    const bodyRect = bodyEl.getBoundingClientRect();
    const detailRect = detailEl.getBoundingClientRect();
    const targetTop = bodyEl.scrollTop + (detailRect.top - bodyRect.top) - 14;
    bodyEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

  const scrollToDiagram = () => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setFlashTick((t) => t + 1);
  };

  const isHighlighted = (id: GlossaryTermId) => activeTermId === id;

  const partFill = (id: GlossaryTermId, base: string) =>
    isHighlighted(id) ? '#DCE9DE' : base;

  const partStroke = (id: GlossaryTermId, base = 'transparent') =>
    isHighlighted(id) ? '#5B7B62' : base;

  const partProps = (id: GlossaryTermId) => ({
    key: isHighlighted(id) ? `${id}-${flashTick}` : id,
    className: `anatomy-svg__part ${isHighlighted(id) ? 'anatomy-svg__part--flash' : ''}`,
    onClick: () => handleSelect(id),
  });

  return (
    <div
      className="anatomy-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="anatomy-modal-title"
    >
      <div className="anatomy-modal" onClick={(e) => e.stopPropagation()}>
        <div className="anatomy-modal__head">
          <div>
            <h2 id="anatomy-modal-title" className="anatomy-modal__title">
              サイトの仕組み・場所の名前
            </h2>
            <p className="anatomy-modal__lead">
              図の中のパーツや、言葉を押すと場所が光ってやさしい説明が見られます。
            </p>
          </div>
          <button
            type="button"
            className="anatomy-modal__close"
            onClick={onClose}
            aria-label="図解を閉じる"
          >
            <X size={18} />
          </button>
        </div>

        <div className="anatomy-modal__body" ref={bodyRef}>
          {/* Left / Top: Interactive Natural-living Mini-site SVG */}
          <div className="anatomy-diagram">
            <svg
              className="anatomy-svg"
              viewBox="0 0 264 422"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Webサイトの構造図解"
            >
              <defs>
                <clipPath id="anatomy-hero-clip">
                  <rect x="16" y="78" width="218" height="98" rx="12" />
                </clipPath>
              </defs>

              {/* Browser Window Surface */}
              <rect
                x="6"
                y="6"
                width="252"
                height="410"
                rx="18"
                fill="#FFFDF9"
              />

              {/* Top Page / Subpage Tabs */}
              <g {...partProps('pages')}>
                <rect
                  x="16"
                  y="16"
                  width="88"
                  height="20"
                  rx="7"
                  fill={partFill('pages', '#EFEAE0')}
                  stroke={partStroke('pages')}
                  strokeWidth="2"
                />
                <text x="60" y="29" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#463E36">
                  トップページ
                </text>
                <rect
                  x="108"
                  y="16"
                  width="76"
                  height="20"
                  rx="7"
                  fill={partFill('pages', '#F7F4ED')}
                  stroke={partStroke('pages')}
                  strokeWidth="2"
                />
                <text x="146" y="29" textAnchor="middle" fontSize="8.5" fill="#786E63">
                  下層ページ
                </text>
              </g>

              {/* Loading / Opening badge */}
              <g {...partProps('loading')}>
                <rect
                  x="190"
                  y="16"
                  width="58"
                  height="20"
                  rx="10"
                  fill={isHighlighted('loading') ? '#F5DFD1' : '#F8ECE3'}
                  stroke={isHighlighted('loading') ? '#C87852' : 'transparent'}
                  strokeWidth="2"
                />
                <text x="219" y="29" textAnchor="middle" fontSize="8" fontWeight="600" fill="#A65E3B">
                  導入演出
                </text>
              </g>

              {/* Header */}
              <g {...partProps('header')}>
                <rect
                  x="16"
                  y="42"
                  width="232"
                  height="30"
                  rx="9"
                  fill={partFill('header', '#F5F0E6')}
                  stroke={partStroke('header')}
                  strokeWidth="2"
                />
                {/* Leaf emblem */}
                <circle cx="30" cy="57" r="7" fill="#E3EDE4" />
                <path d="M27 60C27 55.5 30 53 34 53C34 57.5 31.5 60 27 60Z" fill="#6D9174" />
                <text x="42" y="60.5" fontSize="9.5" fontWeight="700" fill="#38312A">
                  森の暮らし
                </text>
              </g>

              {/* Nav / Menu inside Header */}
              <g {...partProps('nav')}>
                <rect
                  x="128"
                  y="47"
                  width="114"
                  height="20"
                  rx="6"
                  fill={partFill('nav', '#FFFDF9')}
                  stroke={partStroke('nav', 'rgba(56, 49, 42, 0.06)')}
                  strokeWidth="1.8"
                />
                <text x="151" y="60" textAnchor="middle" fontSize="8" fill="#5D544B">
                  お店のこと
                </text>
                <text x="195" y="60" textAnchor="middle" fontSize="8" fill="#5D544B">
                  お知らせ
                </text>
                <path
                  d="M224 53H233M224 57H233M224 61H233"
                  stroke="#5B7B62"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Top View / Hero */}
              <g {...partProps('hero')}>
                <g clipPath="url(#anatomy-hero-clip)">
                  <rect
                    x="16"
                    y="78"
                    width="218"
                    height="98"
                    rx="12"
                    fill={partFill('hero', '#EBF1EB')}
                  />
                  {/* Sun & gentle hills */}
                  <circle cx="196" cy="102" r="13" fill="#EDD0B2" opacity="0.85" />
                  <path
                    d="M16 158 Q74 126 138 146 T234 136 L234 176 L16 176 Z"
                    fill="#D7E3D8"
                  />
                  <path
                    d="M16 167 Q92 145 166 158 T234 152 L234 176 L16 176 Z"
                    fill="#C8D8C9"
                  />
                  {/* Small cozy house silhouette on the hill */}
                  <path d="M180 137L188 130.5L196 137" stroke="#A96E4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="183" y="136.5" width="10" height="8" rx="1.2" fill="#CFA082" />
                </g>
                <rect
                  x="16"
                  y="78"
                  width="218"
                  height="98"
                  rx="12"
                  fill="none"
                  stroke={partStroke('hero')}
                  strokeWidth="2.2"
                />
                <text x="32" y="107" fontSize="11.5" fontWeight="700" fill="#38312A">
                  季節と暮らす家
                </text>
                <text x="32" y="122" fontSize="8.5" fill="#6B6258">
                  最初の画面（トップビュー）
                </text>
              </g>

              {/* CTA Button inside Hero */}
              <g {...partProps('button')}>
                <rect
                  x="30"
                  y="136"
                  width="88"
                  height="25"
                  rx="12.5"
                  fill={isHighlighted('button') ? '#C87852' : '#5B7B62'}
                  stroke={isHighlighted('button') ? '#5B7B62' : 'transparent'}
                  strokeWidth="2"
                />
                <text x="74" y="151.5" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="#FFFDF9">
                  ご予約ボタン
                </text>
              </g>

              {/* Hover indicator on button */}
              <g {...partProps('hover')}>
                <circle
                  cx="128"
                  cy="149"
                  r="11.5"
                  fill={partFill('hover', '#FFFDF9')}
                  stroke={partStroke('hover', 'rgba(56, 49, 42, 0.12)')}
                  strokeWidth="2"
                />
                <path d="M125 144L133 149L128.5 150.5L127 155L125 144Z" fill="#544B42" />
              </g>

              {/* Section */}
              <g {...partProps('section')}>
                <rect
                  x="16"
                  y="184"
                  width="218"
                  height="156"
                  rx="12"
                  fill={partFill('section', '#F6F2EA')}
                  stroke={partStroke('section')}
                  strokeWidth="2.2"
                />
                <text x="125" y="203" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#38312A">
                  季節のおしらせ（セクション）
                </text>
              </g>

              {/* Cards inside Section */}
              <g {...partProps('card')}>
                {/* Card 1 */}
                <rect
                  x="26"
                  y="213"
                  width="94"
                  height="86"
                  rx="9"
                  fill={partFill('card', '#FFFDF9')}
                  stroke={partStroke('card', 'rgba(56, 49, 42, 0.06)')}
                  strokeWidth="2"
                />
                <rect x="33" y="220" width="80" height="36" rx="6" fill="#E6EFE7" />
                <path d="M68 243C68 236 73 232 79 232C79 239 75 243 68 243Z" fill="#7DA083" />
                <text x="34" y="270" fontSize="8.5" fontWeight="600" fill="#38312A">
                  春の草花
                </text>
                <text x="34" y="282" fontSize="7.5" fill="#786E63">
                  カード枠
                </text>

                {/* Card 2 */}
                <rect
                  x="130"
                  y="213"
                  width="94"
                  height="86"
                  rx="9"
                  fill={partFill('card', '#FFFDF9')}
                  stroke={partStroke('card', 'rgba(56, 49, 42, 0.06)')}
                  strokeWidth="2"
                />
                <rect x="137" y="220" width="80" height="36" rx="6" fill="#F5EBE0" />
                <circle cx="177" cy="238" r="7" fill="#DFAA88" />
                <text x="138" y="270" fontSize="8.5" fontWeight="600" fill="#38312A">
                  お茶の時間
                </text>
                <text x="138" y="282" fontSize="7.5" fill="#786E63">
                  カード枠
                </text>
              </g>

              {/* Text Link */}
              <g {...partProps('text-link')}>
                <rect
                  x="71"
                  y="307"
                  width="108"
                  height="22"
                  rx="7"
                  fill={partFill('text-link', 'transparent')}
                  stroke={partStroke('text-link')}
                  strokeWidth="2"
                />
                <text
                  x="125"
                  y="321"
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill="#5B7B62"
                  textDecoration="underline"
                >
                  すべてのお知らせを見る →
                </text>
              </g>

              {/* Scrollbar indicator */}
              <g {...partProps('scroll')}>
                <rect
                  x="240"
                  y="80"
                  width="9"
                  height="258"
                  rx="4.5"
                  fill={partFill('scroll', '#F1ECE2')}
                  stroke={partStroke('scroll')}
                  strokeWidth="1.8"
                />
                <rect
                  x="242"
                  y="116"
                  width="5"
                  height="62"
                  rx="2.5"
                  fill={isHighlighted('scroll') ? '#5B7B62' : '#C8BFB2'}
                />
              </g>

              {/* Footer */}
              <g {...partProps('footer')}>
                <rect
                  x="16"
                  y="348"
                  width="232"
                  height="54"
                  rx="11"
                  fill={partFill('footer', '#ECE5D8')}
                  stroke={partStroke('footer')}
                  strokeWidth="2.2"
                />
                <text x="132" y="371" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#38312A">
                  フッター（住所・営業時間・SNS）
                </text>
                <text x="132" y="386" textAnchor="middle" fontSize="8" fill="#6B6258">
                  © 2026 森の暮らし
                </text>
              </g>
            </svg>
            <span className="anatomy-diagram__hint">図のパーツを押して場所を確認できます</span>
          </div>

          {/* Right / Bottom: Term Pills & Friendly Explanation */}
          <div className="anatomy-panel">
            <div className="anatomy-terms" role="tablist" aria-label="用語一覧">
              {GLOSSARY_TERMS.map((term) => {
                const active = term.id === activeTermId;
                return (
                  <button
                    key={term.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`anatomy-term-pill ${active ? 'anatomy-term-pill--active' : ''}`}
                    onClick={() => handleSelect(term.id)}
                  >
                    {term.title}
                  </button>
                );
              })}
            </div>

            <div className="anatomy-detail" ref={detailRef}>
              <div className="anatomy-detail__top">
                <span className="anatomy-detail__badge">場所・言葉の解説</span>
                <button
                  type="button"
                  className="anatomy-detail__back-btn"
                  onClick={scrollToDiagram}
                >
                  <ArrowUp size={12} />
                  図解へ戻る
                </button>
              </div>
              <h3 className="anatomy-detail__title">{activeTerm.title}</h3>
              <p className="anatomy-detail__subtitle">{activeTerm.subtitle}</p>
              <p className="anatomy-detail__desc">{activeTerm.description}</p>
              <div className="anatomy-detail__tip">
                <span className="anatomy-detail__tip-label">ひとことメモ</span>
                <span>{activeTerm.tip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Toast with quick jump to explanation */}
        {toastTitle && (
          <div className="anatomy-toast-wrap" role="status" aria-live="polite">
            <div className="anatomy-toast">
              <span className="anatomy-toast__text">
                「{toastTitle}」を選択しました
              </span>
              <button
                type="button"
                className="anatomy-toast__btn"
                onClick={scrollToDetail}
              >
                解説を見る
                <ArrowDown size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
