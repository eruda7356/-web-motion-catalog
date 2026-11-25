import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CategoryDef, CategoryId } from '../types/motion';
import './SlidingTabs.css';

interface SlidingTabsProps {
  categories: CategoryDef[];
  activeId: CategoryId;
  onChange: (id: CategoryId) => void;
}

export function SlidingTabs({ categories, activeId, onChange }: SlidingTabsProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const btn = buttonRefs.current[activeId];
      if (!btn) return;
      setIndicator({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        ready: true,
      });
    };

    updatePosition();
    if (document.fonts?.ready) {
      document.fonts.ready.then(updatePosition);
    }
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [activeId, categories]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const btn = buttonRefs.current[activeId];
    if (!wrap || !btn) return;
    if (wrap.scrollWidth <= wrap.clientWidth) return;

    const targetScroll = btn.offsetLeft - wrap.clientWidth / 2 + btn.offsetWidth / 2;
    wrap.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
  }, [activeId]);

  return (
    <div className="sliding-tabs-wrap" ref={wrapRef}>
      <div className="sliding-tabs" role="tablist" aria-label="動きのカテゴリー">
        {indicator.ready && (
          <div
            className="sliding-tabs__indicator"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
            }}
            aria-hidden="true"
          />
        )}
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              ref={(el) => {
                buttonRefs.current[cat.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`sliding-tabs__tab ${isActive ? 'sliding-tabs__tab--active' : ''}`}
              onClick={() => onChange(cat.id)}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
