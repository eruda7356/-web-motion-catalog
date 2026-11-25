import { useEffect, useState } from 'react';

interface TextDemosProps {
  motionId: string;
  replayKey: number;
  disabled: boolean;
}

const SCRAMBLE_TARGET = 'ABCDE';
const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#*+/';
const FLAP_TARGET = ['A', 'B', 'C', 'D', 'E'];
const FLAP_STEPS = [
  ['M', 'O', 'R', 'I', '·'],
  ['S', 'O', 'R', 'A', '·'],
  ['A', 'B', 'C', 'D', 'E'],
];

export function TextDemos({ motionId, replayKey, disabled }: TextDemosProps) {
  // 11. Count-up
  const [countValue, setCountValue] = useState(0);

  // 13. Typewriter
  const [typedCount, setTypedCount] = useState(0);

  // 15. Text Scramble
  const [scrambled, setScrambled] = useState(SCRAMBLE_TARGET);

  // 17. Split-flap Display
  const [flapChars, setFlapChars] = useState<string[]>(FLAP_TARGET);
  const [flapPulse, setFlapPulse] = useState(0);

  // Count-up effect
  useEffect(() => {
    if (motionId !== 'count-up') return;
    setCountValue(0);
    const target = 128;
    const duration = 1050;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCountValue(Math.round(eased * target));
      if (p < 1) {
        frame = requestAnimationFrame(step);
      }
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [motionId, replayKey]);

  // Typewriter effect ("ABCDE")
  useEffect(() => {
    if (motionId !== 'typewriter') return;
    setTypedCount(0);
    const letters = 'ABCDE';
    const interval = window.setInterval(() => {
      setTypedCount((prev) => {
        if (prev >= letters.length) {
          window.clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 240);
    return () => window.clearInterval(interval);
  }, [motionId, replayKey]);

  // Text Scramble effect ("ABCDE")
  useEffect(() => {
    if (motionId !== 'text-scramble') return;
    let tick = 0;
    const totalTicks = 22;
    const interval = window.setInterval(() => {
      tick += 1;
      const resolvedCount = Math.floor((tick / totalTicks) * SCRAMBLE_TARGET.length);
      const next = SCRAMBLE_TARGET.split('')
        .map((ch, idx) => {
          if (idx < resolvedCount) return ch;
          return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
        })
        .join('');
      setScrambled(next);
      if (tick >= totalTicks) {
        setScrambled(SCRAMBLE_TARGET);
        window.clearInterval(interval);
      }
    }, 52);
    return () => window.clearInterval(interval);
  }, [motionId, replayKey]);

  // Split-flap Display effect ("ABCDE")
  useEffect(() => {
    if (motionId !== 'split-flap') return;
    setFlapChars(FLAP_STEPS[0]);
    setFlapPulse((p) => p + 1);
    const t1 = window.setTimeout(() => {
      setFlapChars(FLAP_STEPS[1]);
      setFlapPulse((p) => p + 1);
    }, 340);
    const t2 = window.setTimeout(() => {
      setFlapChars(FLAP_STEPS[2]);
      setFlapPulse((p) => p + 1);
    }, 700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [motionId, replayKey]);

  switch (motionId) {
    case 'count-up':
      return (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginBottom: 3 }}>
            これまでの開催回数
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: 'var(--accent-sage)',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {countValue}
            <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 3, color: 'var(--text-primary)' }}>
              回
            </span>
          </div>
        </div>
      );

    case 'marquee': {
      const tags = ['あいうえお', '森の暮らし', 'ABCDE', '季節の便り', '陽だまりの家'];
      return (
        <div key={replayKey} className="demo-marquee-wrap">
          <div className="demo-marquee-track">
            {[...tags, ...tags].map((word, idx) => (
              <span key={idx} className="demo-marquee-pill">
                {word}
              </span>
            ))}
          </div>
        </div>
      );
    }

    case 'typewriter':
      return (
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: 'var(--text-primary)',
          }}
        >
          {'ABCDE'.slice(0, typedCount)}
          <span
            style={{
              display: 'inline-block',
              width: 2,
              height: 22,
              backgroundColor: 'var(--accent-sage)',
              verticalAlign: 'middle',
              marginLeft: 3,
              animation: 'demoTypeCursor 0.8s infinite',
            }}
          />
        </div>
      );

    case 'text-reveal':
      return (
        <div key={replayKey} className="demo-text-reveal">
          <div className="demo-text-reveal__mask">
            <span
              className="demo-text-reveal__line"
              style={{ animation: 'demoMaskRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.08s forwards' }}
            >
              あいうえお
            </span>
          </div>
          <div className="demo-text-reveal__mask">
            <span
              className="demo-text-reveal__sub"
              style={{ animation: 'demoMaskRise 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.28s forwards' }}
            >
              森のほとりの暮らし
            </span>
          </div>
        </div>
      );

    case 'text-scramble':
      return (
        <div
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--text-primary)',
          }}
        >
          {scrambled}
        </div>
      );

    case 'line-drawing':
      return (
        <svg key={replayKey} width="132" height="88" viewBox="0 0 132 88" fill="none" aria-hidden="true">
          {/* Roof */}
          <path
            d="M22 44 L54 18 L86 44"
            stroke="#C87852"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            strokeDashoffset="100"
            style={{ animation: 'demoLinePath 0.65s ease 0.05s forwards' }}
          />
          {/* House body */}
          <path
            d="M32 44 V72 H76 V44"
            stroke="#6B6258"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="120"
            strokeDashoffset="120"
            style={{ animation: 'demoLinePath 0.75s ease 0.55s forwards' }}
          />
          {/* Leaf */}
          <path
            d="M88 70 C88 52, 102 42, 114 44 C114 60, 103 70, 88 70 Z"
            stroke="#5B7B62"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            strokeDashoffset="100"
            style={{ animation: 'demoLinePath 0.7s ease 1.05s forwards' }}
          />
        </svg>
      );

    case 'split-flap':
      return (
        <>
          <button
            type="button"
            className="demo-flap-board"
            onClick={() => {
              setFlapChars(FLAP_STEPS[0]);
              setFlapPulse((p) => p + 1);
              window.setTimeout(() => {
                setFlapChars(FLAP_STEPS[2]);
                setFlapPulse((p) => p + 1);
              }, 280);
            }}
            tabIndex={disabled ? -1 : 0}
          >
            {flapChars.map((ch, idx) => (
              <span
                key={`${idx}-${flapPulse}`}
                className="demo-flap-tile"
                style={{ animationDelay: `${idx * 0.055}s` }}
              >
                <span className="demo-flap-tile__char">{ch}</span>
                <span className="demo-flap-tile__split" aria-hidden="true" />
              </span>
            ))}
          </button>
          <span className="demo-hint">タップ・再生でパタパタ切り替わります</span>
        </>
      );

    default:
      return null;
  }
}
