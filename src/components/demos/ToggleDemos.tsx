import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { HouseMotif, LeafMotif } from './shared';

interface ToggleDemosProps {
  motionId: string;
  replayKey: number;
  disabled: boolean;
}

const CAROUSEL_SLIDES = [
  { title: '朝の庭', sub: '朝露にぬれる草花', bg: '#E8F0E8', icon: 'leaf' as const },
  { title: '午後の珈琲', sub: '窓辺でひと息つく時間', bg: '#F4EAE0', icon: 'house' as const },
  { title: '夕暮れの灯り', sub: '静かに一日を閉じる', bg: '#EBE6EC', icon: 'leaf' as const },
];

const SWIPE_DECK = [
  { id: 'c1', title: '春の草花', sub: '季節のたより 1/3', bg: '#FFFDF9', icon: 'leaf' as const },
  { id: 'c2', title: '陽だまりの縁側', sub: '季節のたより 2/3', bg: '#FCF8F1', icon: 'house' as const },
  { id: 'c3', title: '森の珈琲時間', sub: '季節のたより 3/3', bg: '#F8FBF8', icon: 'leaf' as const },
];

const FLIP_ITEMS = [
  { id: 'f1', label: '朝露', tag: 'forest' as const, bg: '#E6EFE7' },
  { id: 'f2', label: '縁側', tag: 'house' as const, bg: '#F4E8DD' },
  { id: 'f3', label: '木漏れ日', tag: 'forest' as const, bg: '#E6EFE7' },
  { id: 'f4', label: '窓辺', tag: 'house' as const, bg: '#F4E8DD' },
];

type FlipFilter = 'all' | 'forest' | 'house';

export function ToggleDemos({ motionId, replayKey, disabled }: ToggleDemosProps) {
  // 8. Dropdown Menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('季節のメニュー');

  // 9. Accordion
  const [accordionOpen, setAccordionOpen] = useState(true);

  // 10. Modal
  const [modalOpen, setModalOpen] = useState(false);

  // 11. Sliding Tab
  const [activeMiniTab, setActiveMiniTab] = useState(0);

  // 12. Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 13. Carousel
  const [carouselIdx, setCarouselIdx] = useState(0);

  // 14. Comparison Slider
  const [comparePos, setComparePos] = useState(50);
  const compareRef = useRef<HTMLDivElement>(null);
  const compareDragging = useRef(false);

  // 15. Swipe Cards
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [flyDir, setFlyDir] = useState<-1 | 0 | 1>(0);
  const dragStartX = useRef(0);

  // 16. FLIP Animation
  const [flipFilter, setFlipFilter] = useState<FlipFilter>('all');
  const flipItemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const prevFlipRects = useRef<Record<string, DOMRect>>({});

  // Replay triggers for each toggle demo
  useEffect(() => {
    if (replayKey === 0) return;

    if (motionId === 'dropdown-menu') {
      setDropdownOpen(true);
    } else if (motionId === 'accordion') {
      setAccordionOpen((v) => !v);
    } else if (motionId === 'modal-dialog') {
      setModalOpen(true);
    } else if (motionId === 'sliding-tabs') {
      setActiveMiniTab((prev) => (prev + 1) % 3);
    } else if (motionId === 'drawer-menu') {
      setDrawerOpen(true);
    } else if (motionId === 'carousel') {
      setCarouselIdx((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    } else if (motionId === 'comparison-slider') {
      const start = performance.now();
      const duration = 1350;
      let frame = 0;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const pos = 50 - Math.sin(p * Math.PI * 2) * 30;
        setComparePos(pos);
        if (p < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setComparePos(50);
        }
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    } else if (motionId === 'swipe-cards') {
      triggerSwipe(1);
    } else if (motionId === 'flip-animation') {
      const order: FlipFilter[] = ['all', 'forest', 'house'];
      const next = order[(order.indexOf(flipFilter) + 1) % order.length];
      applyFlipFilter(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionId, replayKey]);

  // Comparison Slider helpers
  const updateCompareFromClientX = (clientX: number) => {
    const el = compareRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setComparePos(Math.max(8, Math.min(92, pct)));
  };

  const handleCompareDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    compareDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateCompareFromClientX(e.clientX);
  };

  const handleCompareMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!compareDragging.current) return;
    updateCompareFromClientX(e.clientX);
  };

  const handleCompareUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    compareDragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Swipe Cards helpers
  const triggerSwipe = (dir: -1 | 1) => {
    if (flyDir !== 0) return;
    setFlyDir(dir);
    window.setTimeout(() => {
      setSwipeIndex((prev) => (prev + 1) % SWIPE_DECK.length);
      setFlyDir(0);
      setDragX(0);
    }, 280);
  };

  const handleCardPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (flyDir !== 0) return;
    setIsDraggingCard(true);
    dragStartX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleCardPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingCard) return;
    setDragX(e.clientX - dragStartX.current);
  };

  const handleCardPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingCard) return;
    setIsDraggingCard(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (Math.abs(dragX) > 42) {
      triggerSwipe(dragX > 0 ? 1 : -1);
    } else {
      setDragX(0);
    }
  };

  // FLIP Animation helpers
  const visibleFlipItems =
    flipFilter === 'all' ? FLIP_ITEMS : FLIP_ITEMS.filter((item) => item.tag === flipFilter);

  const applyFlipFilter = (next: FlipFilter) => {
    const rects: Record<string, DOMRect> = {};
    Object.entries(flipItemRefs.current).forEach(([id, node]) => {
      if (node) rects[id] = node.getBoundingClientRect();
    });
    prevFlipRects.current = rects;
    setFlipFilter(next);
  };

  useLayoutEffect(() => {
    if (motionId !== 'flip-animation') return;
    const prevRects = prevFlipRects.current;
    if (Object.keys(prevRects).length === 0) return;

    visibleFlipItems.forEach((item) => {
      const node = flipItemRefs.current[item.id];
      const prev = prevRects[item.id];
      if (!node) return;

      if (prev) {
        const next = node.getBoundingClientRect();
        const dx = prev.left - next.left;
        const dy = prev.top - next.top;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
          node.style.transition = 'none';
          node.style.transform = `translate(${dx}px, ${dy}px)`;
          node.getBoundingClientRect();
          node.style.transition = 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)';
          node.style.transform = 'translate(0, 0)';
        }
      } else {
        node.style.transition = 'none';
        node.style.opacity = '0';
        node.style.transform = 'scale(0.9)';
        node.getBoundingClientRect();
        node.style.transition =
          'opacity 0.28s ease, transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)';
        node.style.opacity = '1';
        node.style.transform = 'scale(1)';
      }
    });

    prevFlipRects.current = {};
  }, [flipFilter, motionId, visibleFlipItems]);

  switch (motionId) {
    case 'dropdown-menu':
      return (
        <>
          <div className="demo-dropdown-wrap">
            <button
              type="button"
              className="demo-dropdown-trigger"
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              tabIndex={disabled ? -1 : 0}
            >
              <span>{selectedMenu}</span>
              <ChevronDown
                size={13}
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.22s ease',
                }}
              />
            </button>
            <div className={`demo-dropdown-list ${dropdownOpen ? 'demo-dropdown-list--open' : ''}`}>
              {['春のお茶会', '夏の風鈴市', '秋の収穫祭'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`demo-dropdown-item ${selectedMenu === item ? 'demo-dropdown-item--active' : ''}`}
                  onClick={() => {
                    setSelectedMenu(item);
                    setDropdownOpen(false);
                  }}
                  tabIndex={disabled || !dropdownOpen ? -1 : 0}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <span className="demo-hint">ボタンを押すと下に開きます</span>
        </>
      );

    case 'accordion':
      return (
        <>
          <div className="demo-accordion-box">
            <button
              type="button"
              className="demo-accordion-head"
              onClick={() => setAccordionOpen((v) => !v)}
              tabIndex={disabled ? -1 : 0}
            >
              <span>営業時間を教えてください</span>
              <ChevronDown
                size={14}
                style={{
                  transform: accordionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease',
                }}
              />
            </button>
            <div className={`demo-accordion-body ${accordionOpen ? 'demo-accordion-body--open' : ''}`}>
              <div className="demo-accordion-inner">
                <div style={{ paddingTop: 6 }}>
                  水〜日曜の 10:00〜17:00 に開いています。祝日はお休みです。
                </div>
              </div>
            </div>
          </div>
          <span className="demo-hint">質問を押すと開閉します</span>
        </>
      );

    case 'modal-dialog':
      return (
        <>
          <button
            type="button"
            className="demo-ripple-btn"
            onClick={() => setModalOpen(true)}
            tabIndex={disabled ? -1 : 0}
          >
            お知らせを開く
          </button>
          {modalOpen && (
            <div
              className="demo-mini-modal-backdrop"
              onClick={() => setModalOpen(false)}
            >
              <div
                className="demo-mini-modal-box"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="demo-mini-modal-head">
                  <span>季節の展示会</span>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="demo-mini-modal-close"
                    aria-label="閉じる"
                  >
                    <X size={13} />
                  </button>
                </div>
                <div className="demo-mini-modal-text">
                  今週土曜日より、森のアトリエにて開催します。
                </div>
              </div>
            </div>
          )}
          <span className="demo-hint">ボタンを押すと小窓が開きます</span>
        </>
      );

    case 'sliding-tabs':
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div className="demo-mini-tabs">
              <div
                className="demo-mini-tabs__pill"
                style={{ transform: `translateX(${activeMiniTab * 58}px)` }}
              />
              {['朝', '昼', '夜'].map((label, idx) => (
                <button
                  key={label}
                  type="button"
                  className={`demo-mini-tabs__btn ${activeMiniTab === idx ? 'demo-mini-tabs__btn--active' : ''}`}
                  onClick={() => setActiveMiniTab(idx)}
                  tabIndex={disabled ? -1 : 0}
                >
                  {label}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {activeMiniTab === 0 && '焼きたてのパンと珈琲の時間'}
              {activeMiniTab === 1 && '日差しが差し込むランチの時間'}
              {activeMiniTab === 2 && '静かな灯りと温かいスープ'}
            </div>
          </div>
          <span className="demo-hint">タブを押して切り替え</span>
        </>
      );

    case 'drawer-menu':
      return (
        <>
          <div className="demo-drawer-stage">
            <div className="demo-drawer-header">
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                森のパン屋
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
                className="demo-drawer-menu-btn"
                aria-label="メニューを開く"
                tabIndex={disabled ? -1 : 0}
              >
                <Menu size={14} />
              </button>
            </div>
            <div style={{ textAlign: 'center', paddingBottom: 16 }}>
              <LeafMotif size={30} />
            </div>
          </div>

          {drawerOpen && (
            <div
              className="demo-drawer-backdrop"
              onClick={() => setDrawerOpen(false)}
            />
          )}

          <div
            className={`demo-drawer-panel ${drawerOpen ? 'demo-drawer-panel--open' : ''}`}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="demo-mini-modal-close"
              style={{ alignSelf: 'flex-end' }}
              aria-label="閉じる"
              tabIndex={disabled || !drawerOpen ? -1 : 0}
            >
              <X size={13} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>トップ</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>パンのこと</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>アクセス</span>
          </div>
          <span className="demo-hint">右上の三本線を押してみてください</span>
        </>
      );

    case 'carousel':
      return (
        <>
          <div className="demo-carousel-wrap">
            <button
              type="button"
              className="demo-carousel-arrow"
              onClick={() =>
                setCarouselIdx((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)
              }
              aria-label="前のカードへ"
              tabIndex={disabled ? -1 : 0}
            >
              <ChevronLeft size={14} />
            </button>

            <div className="demo-carousel-viewport">
              <div
                className="demo-carousel-track"
                style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
              >
                {CAROUSEL_SLIDES.map((slide) => (
                  <div key={slide.title} className="demo-carousel-slide">
                    <div className="demo-carousel-card" style={{ backgroundColor: slide.bg }}>
                      {slide.icon === 'leaf' ? <LeafMotif size={26} /> : <HouseMotif />}
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {slide.title}
                        </div>
                        <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>
                          {slide.sub}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="demo-carousel-arrow"
              onClick={() => setCarouselIdx((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
              aria-label="次のカードへ"
              tabIndex={disabled ? -1 : 0}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="demo-carousel-dots">
            {CAROUSEL_SLIDES.map((slide, idx) => (
              <button
                key={slide.title}
                type="button"
                className={`demo-carousel-dot ${carouselIdx === idx ? 'demo-carousel-dot--active' : ''}`}
                onClick={() => setCarouselIdx(idx)}
                aria-label={`${idx + 1}枚目を表示`}
                tabIndex={disabled ? -1 : 0}
              />
            ))}
          </div>
          <span className="demo-hint">矢印や丸を押して切り替え</span>
        </>
      );

    case 'comparison-slider':
      return (
        <>
          <div
            ref={compareRef}
            className="demo-compare-box"
            onPointerDown={handleCompareDown}
            onPointerMove={handleCompareMove}
            onPointerUp={handleCompareUp}
            onPointerCancel={handleCompareUp}
          >
            {/* After layer (right / dusk) */}
            <div className="demo-compare-layer demo-compare-layer--after">
              <svg width="212" height="102" viewBox="0 0 212 102" fill="none" aria-hidden="true">
                <rect width="212" height="102" fill="#F2DFCE" />
                <circle cx="164" cy="30" r="14" fill="#DC9168" />
                <path d="M0 82 Q60 48 122 68 T212 60 L212 102 L0 102 Z" fill="#C9A890" />
                <path d="M0 94 Q80 68 156 80 T212 76 L212 102 L0 102 Z" fill="#A9856E" />
              </svg>
              <span className="demo-compare-tag demo-compare-tag--right">夕暮れ</span>
            </div>

            {/* Before layer (left / morning) clipped by comparePos */}
            <div
              className="demo-compare-layer demo-compare-layer--before"
              style={{ clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}
            >
              <svg width="212" height="102" viewBox="0 0 212 102" fill="none" aria-hidden="true">
                <rect width="212" height="102" fill="#E6F0E7" />
                <circle cx="52" cy="28" r="13" fill="#F2D7A8" />
                <path d="M0 82 Q60 48 122 68 T212 60 L212 102 L0 102 Z" fill="#C6DBC8" />
                <path d="M0 94 Q80 68 156 80 T212 76 L212 102 L0 102 Z" fill="#9BB89F" />
              </svg>
              <span className="demo-compare-tag demo-compare-tag--left">朝の光</span>
            </div>

            {/* Divider & Handle */}
            <div className="demo-compare-divider" style={{ left: `${comparePos}%` }}>
              <div className="demo-compare-handle" aria-hidden="true">
                <ChevronLeft size={10} />
                <ChevronRight size={10} />
              </div>
            </div>
          </div>
          <span className="demo-hint">仕切りを左右に動かして見比べ</span>
        </>
      );

    case 'swipe-cards': {
      const topCard = SWIPE_DECK[swipeIndex];
      const nextCard = SWIPE_DECK[(swipeIndex + 1) % SWIPE_DECK.length];
      const offsetX = flyDir !== 0 ? flyDir * 175 : dragX;
      const rotate = offsetX * 0.085;
      const opacity = flyDir !== 0 ? 0 : Math.max(0.55, 1 - Math.abs(dragX) / 220);

      return (
        <>
          <div className="demo-swipe-wrap">
            <button
              type="button"
              className="demo-carousel-arrow"
              onClick={() => triggerSwipe(-1)}
              aria-label="左へ払う"
              tabIndex={disabled ? -1 : 0}
            >
              <ChevronLeft size={14} />
            </button>

            <div className="demo-swipe-stack">
              {/* Next card peeking underneath */}
              <div className="demo-swipe-card demo-swipe-card--back" style={{ backgroundColor: nextCard.bg }}>
                {nextCard.icon === 'leaf' ? <LeafMotif size={24} /> : <HouseMotif />}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {nextCard.title}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>{nextCard.sub}</div>
                </div>
              </div>

              {/* Active top draggable card */}
              <div
                key={topCard.id}
                className="demo-swipe-card demo-swipe-card--front"
                style={{
                  backgroundColor: topCard.bg,
                  transform: `translateX(${offsetX}px) rotate(${rotate}deg)`,
                  opacity,
                  transition: isDraggingCard
                    ? 'none'
                    : 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.26s ease',
                }}
                onPointerDown={handleCardPointerDown}
                onPointerMove={handleCardPointerMove}
                onPointerUp={handleCardPointerUp}
                onPointerCancel={handleCardPointerUp}
              >
                {topCard.icon === 'leaf' ? <LeafMotif size={26} /> : <HouseMotif />}
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {topCard.title}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>{topCard.sub}</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="demo-carousel-arrow"
              onClick={() => triggerSwipe(1)}
              aria-label="右へ払う"
              tabIndex={disabled ? -1 : 0}
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <span className="demo-hint">左右にドラッグまたは矢印でめくる</span>
        </>
      );
    }

    case 'flip-animation':
      return (
        <>
          <div className="demo-flip-wrap">
            <div className="demo-flip-filters">
              {(
                [
                  { id: 'all', label: 'すべて' },
                  { id: 'forest', label: '森' },
                  { id: 'house', label: '家' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`demo-flip-tab ${flipFilter === tab.id ? 'demo-flip-tab--active' : ''}`}
                  onClick={() => applyFlipFilter(tab.id)}
                  tabIndex={disabled ? -1 : 0}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="demo-flip-grid">
              {visibleFlipItems.map((item) => (
                <div
                  key={item.id}
                  ref={(el) => {
                    flipItemRefs.current[item.id] = el;
                  }}
                  className="demo-flip-card"
                  style={{ backgroundColor: item.bg }}
                >
                  <span className="demo-flip-card__dot" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <span className="demo-hint">タブを押すと滑らかに並び直します</span>
        </>
      );

    default:
      return null;
  }
}
