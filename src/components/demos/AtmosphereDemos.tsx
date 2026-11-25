import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { HouseMotif, LeafMotif } from './shared';

interface AtmosphereDemosProps {
  motionId: string;
  replayKey: number;
  disabled: boolean;
}

export function AtmosphereDemos({ motionId, replayKey, disabled }: AtmosphereDemosProps) {
  // 18. Page Transition
  const [pageIdx, setPageIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);

  // 21. Shine Sweep
  const [shineRun, setShineRun] = useState(0);

  // 23. Pop-up Book
  const [popupKey, setPopupKey] = useState(0);

  // 24. Page Flip
  const [flippedPage, setFlippedPage] = useState(false);

  const triggerPageTransition = () => {
    if (transitioning) return;
    setTransitioning(true);
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = window.setTimeout(() => {
      setPageIdx((p) => (p === 0 ? 1 : 0));
    }, 340);
    window.setTimeout(() => {
      setTransitioning(false);
    }, 760);
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (replayKey === 0) return;
    if (motionId === 'page-transition') {
      triggerPageTransition();
    } else if (motionId === 'shine-sweep') {
      setShineRun((k) => k + 1);
    } else if (motionId === 'popup-book') {
      setPopupKey((k) => k + 1);
    } else if (motionId === 'page-flip') {
      setFlippedPage((v) => !v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionId, replayKey]);

  switch (motionId) {
    case 'page-transition':
      return (
        <div className="demo-atmo-wrap" style={{ backgroundColor: pageIdx === 0 ? '#F3EFE6' : '#E9F0E9' }}>
          <div className="demo-hero-scene">
            {pageIdx === 0 ? <LeafMotif size={28} /> : <HouseMotif />}
            <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>
              {pageIdx === 0 ? 'トップページ' : '季節のお知らせ'}
            </div>
            <button
              type="button"
              className="demo-page-trans-btn"
              onClick={triggerPageTransition}
              tabIndex={disabled ? -1 : 0}
            >
              {pageIdx === 0 ? '次のページへ' : 'トップへ戻る'}
              <ArrowRight size={11} />
            </button>
          </div>
          {transitioning && <div className="demo-page-curtain" />}
          <span className="demo-hint">ボタン・再生で幕が上がって切替</span>
        </div>
      );

    case 'aurora-background':
      return (
        <div key={replayKey} className="demo-atmo-wrap demo-aurora-stage">
          <div className="demo-aurora-blob demo-aurora-blob--1" />
          <div className="demo-aurora-blob demo-aurora-blob--2" />
          <div className="demo-aurora-blob demo-aurora-blob--3" />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
              やわらかな光の背景
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              色がゆっくり揺らぎます
            </div>
          </div>
        </div>
      );

    case 'floating-animation':
      return (
        <div className="demo-float-wrap">
          <div className="demo-float-main">
            <LeafMotif size={38} />
          </div>
          <div className="demo-float-badge">季節の便り</div>
        </div>
      );

    case 'shine-sweep':
      return (
        <>
          <button
            key={shineRun}
            type="button"
            className="demo-shine-btn"
            onClick={() => setShineRun((k) => k + 1)}
            tabIndex={disabled ? -1 : 0}
          >
            <span>ご予約はこちら</span>
            <span className="demo-shine-beam" aria-hidden="true" />
          </button>
          <span className="demo-hint">タップ・再生で光沢がキラッと横切ります</span>
        </>
      );

    case 'glassmorphism':
      return (
        <div key={replayKey} className="demo-atmo-wrap demo-glass-stage">
          <div className="demo-glass-orb demo-glass-orb--1" />
          <div className="demo-glass-orb demo-glass-orb--2" />
          <div className="demo-glass-card">
            <LeafMotif size={24} />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                森のアトリエ
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>
                すりガラス越しの質感
              </div>
            </div>
          </div>
        </div>
      );

    case 'popup-book':
      return (
        <>
          <button
            type="button"
            className="demo-popup-stage"
            onClick={() => setPopupKey((k) => k + 1)}
            tabIndex={disabled ? -1 : 0}
          >
            <div className="demo-popup-floor">
              <div key={popupKey} className="demo-popup-cutout">
                <HouseMotif />
                <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-primary)' }}>
                  森の絵本
                </span>
              </div>
            </div>
          </button>
          <span className="demo-hint">タップ・再生で下辺を軸に起き上がります</span>
        </>
      );

    case 'page-flip':
      return (
        <>
          <button
            type="button"
            className="demo-book-stage"
            onClick={() => setFlippedPage((v) => !v)}
            tabIndex={disabled ? -1 : 0}
            aria-label="ページをめくる"
          >
            <div className="demo-book">
              {/* Left static page */}
              <div className="demo-book-page demo-book-page--left">
                <LeafMotif size={22} />
                <span style={{ fontSize: 9.5, fontWeight: 600 }}>森の暮らし</span>
              </div>

              {/* Right underneath page (revealed after flip) */}
              <div className="demo-book-page demo-book-page--under">
                <HouseMotif />
                <span style={{ fontSize: 9.5, fontWeight: 600 }}>夕べの庭</span>
              </div>

              {/* Flipping leaf */}
              <div className={`demo-book-leaf ${flippedPage ? 'demo-book-leaf--flipped' : ''}`}>
                <div className="demo-book-leaf__face demo-book-leaf__face--front">
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--accent-sage)' }}>
                    朝のページ
                  </span>
                  <span style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>めくる →</span>
                </div>
                <div className="demo-book-leaf__face demo-book-leaf__face--back">
                  <span style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--accent-warm)' }}>
                    第2章
                  </span>
                  <span style={{ fontSize: 8.5, color: 'var(--text-muted)' }}>← 戻る</span>
                </div>
              </div>
            </div>
          </button>
          <span className="demo-hint">本をタップ・再生でページをめくります</span>
        </>
      );

    case 'fluted-glass':
      return (
        <div key={replayKey} className="demo-atmo-wrap demo-fluted-stage">
          <div className="demo-fluted-bg">
            <div className="demo-fluted-orb demo-fluted-orb--1" />
            <div className="demo-fluted-orb demo-fluted-orb--2" />
            <div className="demo-fluted-orb demo-fluted-orb--3" />
          </div>
          <div className="demo-fluted-pane" aria-hidden="true" />
          <div className="demo-fluted-label">縦溝ガラスの揺らぎ</div>
        </div>
      );

    case 'dappled-light':
      return (
        <div key={replayKey} className="demo-atmo-wrap demo-dappled-stage">
          <div className="demo-dappled-sun" />
          <div className="demo-dappled-shadows">
            <span className="demo-dappled-leaf demo-dappled-leaf--1" />
            <span className="demo-dappled-leaf demo-dappled-leaf--2" />
            <span className="demo-dappled-leaf demo-dappled-leaf--3" />
            <span className="demo-dappled-leaf demo-dappled-leaf--4" />
          </div>
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
              こもれび
            </div>
            <div style={{ fontSize: 9.5, color: 'var(--text-secondary)', marginTop: 2 }}>
              葉影と光がゆれる壁
            </div>
          </div>
        </div>
      );

    case 'topographic-lines':
      return (
        <div key={replayKey} className="demo-atmo-wrap demo-topo-stage">
          <svg
            className="demo-topo-svg"
            viewBox="0 0 240 130"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g className="demo-topo-group demo-topo-group--1">
              <path
                d="M-10 92 C35 52, 84 114, 134 72 C172 38, 210 56, 250 30"
                stroke="#85A089"
                strokeWidth="1.1"
                opacity="0.45"
              />
              <path
                d="M-10 108 C42 66, 92 124, 144 82 C182 48, 214 68, 250 44"
                stroke="#85A089"
                strokeWidth="1.1"
                opacity="0.38"
              />
              <path
                d="M-10 124 C48 82, 98 134, 152 94 C190 60, 218 82, 250 60"
                stroke="#85A089"
                strokeWidth="1.1"
                opacity="0.3"
              />
            </g>
            <g className="demo-topo-group demo-topo-group--2">
              <path
                d="M-10 42 C40 12, 90 68, 140 34 C180 8, 216 26, 250 8"
                stroke="#B99C83"
                strokeWidth="1.1"
                opacity="0.42"
              />
              <path
                d="M-10 62 C44 28, 92 84, 144 50 C184 22, 218 42, 250 22"
                stroke="#B99C83"
                strokeWidth="1.1"
                opacity="0.34"
              />
              <ellipse
                cx="64"
                cy="66"
                rx="34"
                ry="19"
                stroke="#85A089"
                strokeWidth="1"
                opacity="0.32"
              />
              <ellipse
                cx="64"
                cy="66"
                rx="18"
                ry="10"
                stroke="#85A089"
                strokeWidth="1"
                opacity="0.28"
              />
            </g>
          </svg>
          <span
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-primary)',
              background: 'rgba(255, 253, 249, 0.72)',
              padding: '4px 12px',
              borderRadius: 999,
            }}
          >
            ゆるやかな等高線
          </span>
        </div>
      );

    default:
      return null;
  }
}
