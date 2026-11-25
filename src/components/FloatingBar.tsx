import { Check, Copy, Star, Trash2 } from 'lucide-react';
import './FloatingBar.css';

interface FloatingBarProps {
  count: number;
  onCopy: () => void;
  onClear: () => void;
  toastVisible: boolean;
}

export function FloatingBar({ count, onCopy, onClear, toastVisible }: FloatingBarProps) {
  const isVisible = count > 0;

  return (
    <>
      <div
        className={`floating-bar-wrap ${isVisible ? 'floating-bar-wrap--visible' : ''}`}
        aria-hidden={!isVisible}
      >
        <div className="floating-bar" role="region" aria-label="選んだ動きの操作バー">
          <div className="floating-bar__count">
            <Star size={15} fill="currentColor" className="floating-bar__star" />
            <span>選んだ動き：{count}件</span>
          </div>
          <div className="floating-bar__actions">
            <button
              type="button"
              className="floating-bar__copy"
              onClick={onCopy}
              tabIndex={isVisible ? 0 : -1}
            >
              <Copy size={14} />
              一覧をコピー
            </button>
            <button
              type="button"
              className="floating-bar__clear"
              onClick={onClear}
              tabIndex={isVisible ? 0 : -1}
            >
              <Trash2 size={13} style={{ marginRight: 4, verticalAlign: '-2px' }} />
              選択をクリア
            </button>
          </div>
        </div>
      </div>

      {toastVisible && (
        <div className="toast-notice" role="status" aria-live="polite">
          <Check size={15} />
          <span>選んだ動きをコピーしました</span>
        </div>
      )}
    </>
  );
}
