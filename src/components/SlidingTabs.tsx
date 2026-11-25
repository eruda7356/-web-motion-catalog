import { useLayoutEffect, useRef, useState } from 'react';
import type { CategoryDef, CategoryId } from '../types/motion';
import './SlidingTabs.css';

interface SlidingTabsProps {
  categories: CategoryDef[];
  activeId: CategoryId;
  onChange: (id: CategoryId) => void;
}

export function SlidingTabs({ categories, activeId, onChange }: SlidingTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    ready: false,
  });

  useLayoutEffect(() => {
    const updatePosition = () => {
      const btn = buttonRefs.current[activeId];
      if (!btn) return;
      setIndicator({
        left: btn.offsetLeft,
        top: btn.offsetTop,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
        ready: true,
      });
    };

    updatePosition();
    if (document.fonts?.ready) {
      document.fonts.ready.then(updatePosition);
    }

    const observer =
      typeof ResizeObserver !== 'undefined' && listRef.current
        ? new ResizeObserver(updatePosition)
        : null;
    if (observer && listRef.current) {
      observer.observe(listRef.current);
    }

    window.addEventListener('resize', updatePosition);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeId, categories]);

  return (
    <div className="sliding-tabs-wrap">
      <div
        className="sliding-tabs"
        ref={listRef}
        role="tablist"
        aria-label="動きのカテゴリー"
      >
        {indicator.ready && (
          <div
            className="sliding-tabs__indicator"
            style={{
              transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
              width: `${indicator.width}px`,
              height: `${indicator.height}px`,
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
