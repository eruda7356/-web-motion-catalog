import { useEffect, useState } from 'react';
import { HouseMotif, LeafMotif } from './shared';

interface OpeningDemoProps {
  motionId: string;
  replayKey: number;
}

export function OpeningDemo({ motionId, replayKey }: OpeningDemoProps) {
  const [percent, setPercent] = useState(0);
  const [countDone, setCountDone] = useState(false);

  useEffect(() => {
    if (motionId !== 'count-up-intro') return;
    setPercent(0);
    setCountDone(false);

    const duration = 1100;
    const start = performance.now();
    let frameId = 0;
    let doneTimer: number | undefined;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(eased * 100);
      setPercent(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        doneTimer = window.setTimeout(() => {
          setCountDone(true);
        }, 180);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, [motionId, replayKey]);

  switch (motionId) {
    case 'logo-stroke-crossfade':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div className="demo-hero-scene">
            <LeafMotif size={34} />
            <div className="demo-hero-title">森のほとりの暮らし</div>
            <div className="demo-hero-sub">季節のうつろいとともに</div>
          </div>

          <div
            className="demo-opening-veil"
            style={{ animation: 'demoVeilFadeOut 0.75s 1.35s ease forwards' }}
          >
            <svg width="112" height="48" viewBox="0 0 112 48" fill="none" aria-hidden="true">
              <path
                d="M16 34 C16 18, 32 10, 44 12 C44 26, 30 34, 16 34 Z M16 34 C28 24, 38 18, 44 12 M54 24 L96 24"
                stroke="#5F7F65"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="160"
                strokeDashoffset="160"
                style={{ animation: 'demoOpeningLogoDraw 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
              />
            </svg>
          </div>
        </div>
      );

    case 'staggered-blur-reveal':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div className="demo-hero-scene">
            <HouseMotif />
            <div className="demo-hero-title">ようこそ、陽だまりの家へ</div>
            <div className="demo-hero-sub">静かな光と木のぬくもり</div>
          </div>

          <div
            className="demo-opening-veil"
            style={{ animation: 'demoVeilFadeOut 0.65s 1.15s ease forwards' }}
          />

          <div
            className="demo-blur-word"
            style={{ animation: 'demoVeilFadeOut 0.5s 1.85s ease forwards' }}
          >
            {'こもれび'.split('').map((ch, idx) => (
              <span
                key={idx}
                className="demo-blur-char"
                style={{
                  animation: `demoBlurCharIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.1}s forwards`,
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      );

    case 'curtain-reveal':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div className="demo-hero-scene">
            <LeafMotif size={34} />
            <div className="demo-hero-title">季節の便り</div>
            <div className="demo-hero-sub">日々の小さな記録</div>
          </div>

          <div
            className="demo-curtain-up"
            style={{ animation: 'demoCurtainUp 0.9s 0.85s cubic-bezier(0.77, 0, 0.175, 1) forwards' }}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: '#4E6B54',
                letterSpacing: '0.18em',
                opacity: 0,
                animation: 'demoFadeIn 0.55s 0.1s ease forwards',
              }}
            >
              森の暮らし
            </span>
          </div>
        </div>
      );

    case 'line-loading':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div className="demo-hero-scene">
            <HouseMotif />
            <div className="demo-hero-title">静かな朝のページ</div>
            <div className="demo-hero-sub">丁寧につくる暮らしの道具</div>
          </div>

          <div
            className="demo-split-half demo-split-half--top"
            style={{ animation: 'demoSplitUp 0.65s 1.05s cubic-bezier(0.77, 0, 0.175, 1) forwards' }}
          />
          <div
            className="demo-split-half demo-split-half--bottom"
            style={{ animation: 'demoSplitDown 0.65s 1.05s cubic-bezier(0.77, 0, 0.175, 1) forwards' }}
          />

          <div
            className="demo-line-loader-track"
            style={{ animation: 'demoVeilFadeOut 0.2s 1.02s ease forwards' }}
          >
            <div
              className="demo-line-loader-bar"
              style={{ animation: 'demoLineLoad 0.85s 0.1s cubic-bezier(0.65, 0, 0.35, 1) forwards' }}
            />
          </div>
        </div>
      );

    case 'split-curtain':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div className="demo-hero-scene">
            <LeafMotif size={34} />
            <div className="demo-hero-title">ようこそ、森のアトリエへ</div>
            <div className="demo-hero-sub">手仕事と自然のいろどり</div>
          </div>

          <div
            className="demo-split-door demo-split-door--left"
            style={{ animation: 'demoSplitLeft 0.95s 0.35s cubic-bezier(0.77, 0, 0.175, 1) forwards' }}
          />
          <div
            className="demo-split-door demo-split-door--right"
            style={{ animation: 'demoSplitRight 0.95s 0.35s cubic-bezier(0.77, 0, 0.175, 1) forwards' }}
          />
        </div>
      );

    case 'circle-reveal':
      return (
        <div key={replayKey} className="demo-opening-wrap" style={{ backgroundColor: '#EAE3D7' }}>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            OPENING
          </span>
          <div
            className="demo-circle-reveal-layer"
            style={{ animation: 'demoCircleReveal 1.15s 0.25s cubic-bezier(0.65, 0, 0.35, 1) forwards' }}
          >
            <div className="demo-hero-scene">
              <HouseMotif />
              <div className="demo-hero-title">ひだまりの庭</div>
              <div className="demo-hero-sub">草花と過ごす週末</div>
            </div>
          </div>
        </div>
      );

    case 'count-up-intro':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div className="demo-hero-scene">
            <LeafMotif size={34} />
            <div className="demo-hero-title">あたらしい季節へ</div>
            <div className="demo-hero-sub">春の展示会のご案内</div>
          </div>

          <div
            className="demo-opening-veil"
            style={{
              opacity: countDone ? 0 : 1,
              transition: 'opacity 0.55s ease',
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: 'var(--accent-sage)',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1.1,
                }}
              >
                {percent}
                <span style={{ fontSize: 12, fontWeight: 500, marginLeft: 2 }}>%</span>
              </div>
              <div style={{ width: 88, height: 2, background: '#E5DDD0', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${percent}%`,
                    height: '100%',
                    background: 'var(--accent-sage)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 'zoom-reveal':
      return (
        <div key={replayKey} className="demo-opening-wrap">
          <div
            className="demo-zoom-scene"
            style={{ animation: 'demoZoomReveal 1.55s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}
          >
            <svg
              width="210"
              height="92"
              viewBox="0 0 210 92"
              fill="none"
              style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', opacity: 0.7 }}
              aria-hidden="true"
            >
              <circle cx="164" cy="24" r="14" fill="#E9C9A8" />
              <path d="M0 84 Q55 40 112 64 T210 56 L210 92 L0 92 Z" fill="#DDE6DD" />
              <path d="M0 92 Q70 58 140 74 T210 70 L210 92 Z" fill="#C9D8C9" />
            </svg>
            <div className="demo-hero-scene" style={{ position: 'relative', zIndex: 1 }}>
              <LeafMotif size={30} />
              <div className="demo-hero-title">森のほとりの暮らし</div>
              <div className="demo-hero-sub">ゆっくり広がるトップの景色</div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
