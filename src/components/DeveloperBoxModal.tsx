import { useEffect } from 'react';
import { Wrench, X } from 'lucide-react';
import './DeveloperBoxModal.css';

interface DeveloperBoxModalProps {
  isOpen: boolean;
  developerMode: boolean;
  onToggleDeveloperMode: () => void;
  onClose: () => void;
}

export function DeveloperBoxModal({
  isOpen,
  developerMode,
  onToggleDeveloperMode,
  onClose,
}: DeveloperBoxModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="devbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="devbox-modal-title"
    >
      <div className="devbox-modal" onClick={(e) => e.stopPropagation()}>
        <div className="devbox-modal__head">
          <div className="devbox-modal__title-wrap">
            <Wrench size={16} className="devbox-modal__icon" />
            <h2 id="devbox-modal-title" className="devbox-modal__title">
              開発者BOX
            </h2>
          </div>
          <button
            type="button"
            className="devbox-modal__close"
            onClick={onClose}
            aria-label="開発者BOXを閉じる"
          >
            <X size={17} />
          </button>
        </div>

        <p className="devbox-modal__notice">
          ※こちらは制作者用の機能です。動きを選んでいる方は関係ありませんので、そのまま閉じて大丈夫です。
        </p>

        <div className="devbox-modal__control">
          <div className="devbox-modal__control-text">
            <span className="devbox-modal__control-label">制作者モードをONにする</span>
            <span className="devbox-modal__control-hint">
              ONにすると、各カードに控えめな「AI指示文コピー」ボタンが表示されます。
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={developerMode}
            aria-label="制作者モードをONにする"
            className={`devbox-switch ${developerMode ? 'devbox-switch--on' : ''}`}
            onClick={onToggleDeveloperMode}
          >
            <span className="devbox-switch__thumb" />
          </button>
        </div>
      </div>
    </div>
  );
}
