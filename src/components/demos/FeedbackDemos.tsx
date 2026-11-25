import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';

interface FeedbackDemosProps {
  motionId: string;
  replayKey: number;
  disabled: boolean;
}

export function FeedbackDemos({ motionId, replayKey, disabled }: FeedbackDemosProps) {
  // Toast notification state
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  // Shake state
  const [shakeCount, setShakeCount] = useState(0);
  const [shakeHint, setShakeHint] = useState(false);
  const shakeTimerRef = useRef<number | null>(null);

  const showToast = () => {
    setToastVisible(false);
    window.requestAnimationFrame(() => {
      setToastVisible(true);
    });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2100);
  };

  const triggerShake = () => {
    setShakeCount((c) => c + 1);
    setShakeHint(true);
    if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
    shakeTimerRef.current = window.setTimeout(() => {
      setShakeHint(false);
    }, 1800);
  };

  useEffect(() => {
    if (motionId === 'toast-notification') {
      showToast();
    }
    if (motionId === 'shake-animation' && replayKey > 0) {
      triggerShake();
    }
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (shakeTimerRef.current) window.clearTimeout(shakeTimerRef.current);
    };
  }, [motionId, replayKey]);

  switch (motionId) {
    case 'skeleton-loading':
      return (
        <div key={replayKey} className="demo-skeleton-card">
          <div
            className="demo-skeleton-block"
            style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div className="demo-skeleton-block" style={{ width: '78%', height: 10 }} />
            <div className="demo-skeleton-block" style={{ width: '54%', height: 8 }} />
            <div className="demo-skeleton-block" style={{ width: '38%', height: 7 }} />
          </div>
        </div>
      );

    case 'toast-notification':
      return (
        <>
          <button
            type="button"
            className="demo-ripple-btn"
            onClick={showToast}
            tabIndex={disabled ? -1 : 0}
          >
            お気に入りに保存
          </button>
          <div
            className={`demo-mini-toast ${toastVisible ? 'demo-mini-toast--visible' : ''}`}
            role="status"
            aria-live="polite"
          >
            <Check size={11} />
            <span>保存しました</span>
          </div>
          <span className="demo-hint">押すと画面端に通知が出て消えます</span>
        </>
      );

    case 'shake-animation':
      return (
        <>
          <div className="demo-shake-form">
            <div
              key={shakeCount}
              className={`demo-shake-input ${shakeCount > 0 && shakeHint ? 'demo-shake-input--error' : ''}`}
            >
              <span>メールアドレス（未入力）</span>
            </div>
            <div className="demo-shake-row">
              <span className={`demo-shake-msg ${shakeHint ? 'demo-shake-msg--visible' : ''}`}>
                入力をご確認ください
              </span>
              <button
                type="button"
                className="demo-shake-btn"
                onClick={triggerShake}
                tabIndex={disabled ? -1 : 0}
              >
                確認する
              </button>
            </div>
          </div>
          <span className="demo-hint">ボタンを押すと入力枠が小さく震えます</span>
        </>
      );

    default:
      return null;
  }
}
